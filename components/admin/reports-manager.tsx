"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useChitFunds } from "@/hooks/use-chit-funds";
import { useChitDraws } from "@/hooks/use-chit-draws";
import { useToast } from "@/hooks/use-toast";
import {
  FileImage,
  FileSpreadsheet,
  Loader2,
  Calendar,
  IndianRupee,
  Trophy,
  Users,
} from "lucide-react";
import { getMonthName } from "@/lib/month-utils";

export function ReportsManager() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadType, setDownloadType] = useState<"excel" | "pdf" | null>(
    null
  );
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get current chit fund data
  const { chitFunds, loading: chitLoading } = useChitFunds();
  const currentChit =
    chitFunds.find((chit) => chit.status === "active") || chitFunds[0];

  // Get draws data
  const { draws, loading: drawsLoading } = useChitDraws(
    currentChit?.id,
    currentChit?.current_month || 1
  );

  const generateExcelReport = async () => {
    try {
      setIsGenerating(true);
      setDownloadType("excel");

      console.log("Starting Excel generation...");

      // Check if we have data
      if (!draws || draws.length === 0) {
        throw new Error("No draws data available");
      }

      // Dynamic import to avoid SSR issues
      const XLSX = await import("xlsx");
      console.log("XLSX library loaded:", !!XLSX);

      // Prepare data for Excel
      const reportData = draws.map((draw, index) => ({
        "S.No": index + 1,
        Month: getMonthName(draw.month_number, currentChit?.start_date),
        "Draw Date": new Date(draw.draw_date).toLocaleDateString(),
        Status: draw.status,
        Winner: draw.winner_name || "Not Declared",
        Participants: draw.participants?.join(", ") || "None",
        "Payout Amount": draw.payout_amount,
        "Benefit Amount": draw.benefit_amount,
        "Participant Count": draw.participants?.length || 0,
      }));

      console.log("Report data prepared:", reportData.length, "rows");

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Create main draws sheet
      const ws = XLSX.utils.json_to_sheet(reportData);

      // Set column widths
      const colWidths = [
        { wch: 8 }, // S.No
        { wch: 15 }, // Month
        { wch: 12 }, // Draw Date
        { wch: 12 }, // Status
        { wch: 20 }, // Winner
        { wch: 30 }, // Participants
        { wch: 18 }, // Payout Amount
        { wch: 18 }, // Benefit Amount
        { wch: 15 }, // Participant Count
      ];
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Chit Fund Draws");

      // Create summary sheet
      const summaryData = [
        { Metric: "Chit Fund Name", Value: currentChit?.name || "N/A" },
        {
          Metric: "Total Amount",
          Value: currentChit?.total_amount?.toLocaleString() || "N/A",
        },
        {
          Metric: "Monthly Payment",
          Value: currentChit?.monthly_payment?.toLocaleString() || "N/A",
        },
        {
          Metric: "Duration (Months)",
          Value: currentChit?.duration_months || "N/A",
        },
        {
          Metric: "Start Date",
          Value: currentChit?.start_date
            ? new Date(currentChit.start_date).toLocaleDateString()
            : "N/A",
        },
        { Metric: "Current Month", Value: currentChit?.current_month || "N/A" },
        { Metric: "Status", Value: currentChit?.status || "N/A" },
        { Metric: "Total Draws", Value: draws.length },
        {
          Metric: "Completed Draws",
          Value: draws.filter((d) => d.status === "completed").length,
        },
        {
          Metric: "Pending Draws",
          Value: draws.filter((d) => d.status === "pending").length,
        },
        {
          Metric: "Total Payout",
          Value: draws
            .reduce((sum, d) => sum + d.payout_amount, 0)
            .toLocaleString(),
        },
        { Metric: "Report Generated", Value: new Date().toLocaleString() },
      ];

      const summaryWs = XLSX.utils.json_to_sheet(summaryData);
      summaryWs["!cols"] = [{ wch: 20 }, { wch: 25 }];
      XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

      console.log("Workbook created with sheets");

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `Chit_Fund_Report_${timestamp}.xlsx`;

      console.log("Attempting to download file:", filename);

      // Download file
      XLSX.writeFile(wb, filename);

      console.log("File download initiated");

      toast({
        title: "Excel Report Generated",
        description: `Report downloaded as ${filename}`,
      });
    } catch (error) {
      console.error("Excel generation error:", error);
      toast({
        title: "Error",
        description: `Failed to generate Excel report: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setDownloadType(null);
    }
  };

  const generatePDFReport = async () => {
    try {
      setIsGenerating(true);
      setDownloadType("pdf");

      console.log("Generating colorful PDF report...");

      const jsPDFModule = await import("jspdf");
      const pdf = new jsPDFModule.jsPDF("p", "mm", "a4");

      // Define colors
      const colors = {
        primary: [37, 99, 235] as [number, number, number], // Blue
        secondary: [107, 114, 128] as [number, number, number], // Gray
        success: [34, 197, 94] as [number, number, number], // Green
        warning: [245, 158, 11] as [number, number, number], // Orange
        danger: [239, 68, 68] as [number, number, number], // Red
        white: [255, 255, 255] as [number, number, number],
        lightBlue: [239, 246, 255] as [number, number, number],
        lightGreen: [240, 253, 244] as [number, number, number],
        lightOrange: [255, 247, 237] as [number, number, number],
        darkBlue: [30, 64, 175] as [number, number, number],
        yellow: [255, 193, 7] as [number, number, number],
      };

      let yPos = 20;

      // Header with background
      pdf.setFillColor(...colors.primary);
      pdf.rect(0, 0, 210, 40, "F");

      pdf.setTextColor(...colors.white);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("CHIT FUND REPORT", 105, 20, { align: "center" });

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${currentChit?.name || "N/A"}`, 105, 30, { align: "center" });

      yPos = 50;

      // Report Info Box
      pdf.setFillColor(...colors.lightBlue);
      pdf.rect(15, yPos, 180, 20, "F");
      pdf.setDrawColor(...colors.primary);
      pdf.rect(15, yPos, 180, 20, "S");

      pdf.setTextColor(...colors.darkBlue);
      pdf.setFontSize(10);
      pdf.text(
        `Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
        20,
        yPos + 8
      );
      pdf.text(
        `Report ID: CHT-${Date.now().toString().slice(-6)}`,
        20,
        yPos + 15
      );

      yPos += 35;

      // Summary Statistics Section
      pdf.setTextColor(...colors.primary);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("SUMMARY STATISTICS", 20, yPos);
      yPos += 15;

      // Statistics Cards
      const stats = [
        {
          label: "Total Amount",
          value: `₹${currentChit?.total_amount?.toLocaleString() || "N/A"}`,
          color: colors.primary,
        },
        {
          label: "Monthly Payment",
          value: `₹${currentChit?.monthly_payment?.toLocaleString() || "N/A"}`,
          color: colors.success,
        },
        {
          label: "Duration",
          value: `${currentChit?.duration_months || "N/A"} months`,
          color: colors.warning,
        },
        {
          label: "Current Month",
          value: `${currentChit?.current_month || "N/A"}`,
          color: colors.danger,
        },
      ];

      stats.forEach((stat, index) => {
        const x = 20 + (index % 2) * 90;
        const y = yPos + Math.floor(index / 2) * 25;

        // Card background
        pdf.setFillColor(...stat.color);
        pdf.rect(x, y, 80, 20, "F");

        // Card border
        pdf.setDrawColor(...stat.color);
        pdf.rect(x, y, 80, 20, "S");

        // Text
        pdf.setTextColor(...colors.white);
        pdf.setFontSize(8);
        pdf.text(stat.label, x + 5, y + 8);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(stat.value, x + 5, y + 16);
        pdf.setFont("helvetica", "normal");
      });

      yPos += 60;

      // Draws Summary
      const drawStats = [
        { label: "Total Draws", value: draws.length, color: colors.primary },
        {
          label: "Completed",
          value: draws.filter((d) => d.status === "completed").length,
          color: colors.success,
        },
        {
          label: "Pending",
          value: draws.filter((d) => d.status === "pending").length,
          color: colors.warning,
        },
        {
          label: "Total Payout",
          value: `₹${draws
            .reduce((sum, d) => sum + d.payout_amount, 0)
            .toLocaleString()}`,
          color: colors.danger,
        },
      ];

      drawStats.forEach((stat, index) => {
        const x = 20 + (index % 2) * 90;
        const y = yPos + Math.floor(index / 2) * 25;

        pdf.setFillColor(...stat.color);
        pdf.rect(x, y, 80, 20, "F");
        pdf.setDrawColor(...stat.color);
        pdf.rect(x, y, 80, 20, "S");

        pdf.setTextColor(...colors.white);
        pdf.setFontSize(8);
        pdf.text(stat.label, x + 5, y + 8);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(stat.value.toString(), x + 5, y + 16);
        pdf.setFont("helvetica", "normal");
      });

      yPos += 70;

      // Monthly Draws Table
      pdf.setTextColor(...colors.primary);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("MONTHLY DRAWS DETAILS", 20, yPos);
      yPos += 15;

      // Table Header
      const tableHeaders = [
        { text: "Month", x: 20, width: 35 },
        { text: "Date", x: 55, width: 25 },
        { text: "Status", x: 80, width: 25 },
        { text: "Winner", x: 105, width: 45 },
        { text: "Participants", x: 150, width: 25 },
        { text: "Payout (₹)", x: 175, width: 20 },
      ];

      // Header background
      pdf.setFillColor(...colors.yellow);
      pdf.rect(15, yPos - 5, 180, 12, "F");
      pdf.setDrawColor(...colors.primary);
      pdf.rect(15, yPos - 5, 180, 12, "S");

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");

      tableHeaders.forEach((header) => {
        pdf.text(header.text, header.x, yPos + 3);
      });

      yPos += 15;

      // Table Data
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);

      draws.forEach((draw, index) => {
        // Check if we need a new page
        if (yPos > 260) {
          pdf.addPage();
          yPos = 30;

          // Repeat header on new page
          pdf.setFillColor(...colors.yellow);
          pdf.rect(15, yPos - 5, 180, 12, "F");
          pdf.setDrawColor(...colors.primary);
          pdf.rect(15, yPos - 5, 180, 12, "S");

          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "bold");

          tableHeaders.forEach((header) => {
            pdf.text(header.text, header.x, yPos + 3);
          });

          yPos += 15;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(8);
        }

        // Row background (alternating colors)
        if (index % 2 === 0) {
          pdf.setFillColor(248, 250, 252); // Light gray
          pdf.rect(15, yPos - 3, 180, 10, "F");
        }

        // Row border
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(15, yPos - 3, 180, 10, "S");

        // Status color coding
        let statusColor = colors.secondary;
        if (draw.status === "completed") {
          statusColor = colors.success;
        } else if (draw.status === "pending") {
          statusColor = colors.warning;
        }

        // Row data
        pdf.setTextColor(0, 0, 0);
        pdf.text(
          getMonthName(draw.month_number, currentChit?.start_date),
          20,
          yPos + 2
        );
        pdf.text(new Date(draw.draw_date).toLocaleDateString(), 55, yPos + 2);

        // Status with color
        pdf.setTextColor(...statusColor);
        pdf.text(draw.status.toUpperCase(), 80, yPos + 2);

        pdf.setTextColor(0, 0, 0);
        const winnerText = draw.winner_name || "Not Declared";
        pdf.text(
          winnerText.length > 20
            ? winnerText.substring(0, 17) + "..."
            : winnerText,
          105,
          yPos + 2
        );

        const participantCount = draw.participants?.length || 0;
        pdf.text(participantCount.toString(), 150, yPos + 2);

        // Payout with color
        pdf.setTextColor(...colors.success);
        pdf.text(draw.payout_amount.toLocaleString(), 175, yPos + 2);

        yPos += 10;
      });

      // Footer
      yPos += 20;
      if (yPos > 260) {
        pdf.addPage();
        yPos = 30;
      }

      // Footer background
      pdf.setFillColor(...colors.lightBlue);
      pdf.rect(15, yPos, 180, 25, "F");
      pdf.setDrawColor(...colors.primary);
      pdf.rect(15, yPos, 180, 25, "S");

      pdf.setTextColor(...colors.primary);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("REPORT SUMMARY", 20, yPos + 8);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.text(
        `This report contains ${draws.length} monthly draws from ${
          currentChit?.name || "Chit Fund"
        }`,
        20,
        yPos + 15
      );
      pdf.text(
        `Generated by Chit Fund Management System on ${new Date().toLocaleDateString()}`,
        20,
        yPos + 20
      );

      // Page numbers
      const pageCount = (pdf as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setTextColor(...colors.secondary);
        pdf.setFontSize(8);
        pdf.text(`Page ${i} of ${pageCount}`, 190, 285, { align: "right" });
      }

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `Chit_Fund_Colorful_Report_${timestamp}.pdf`;

      // Download PDF
      pdf.save(filename);

      console.log("Colorful PDF download initiated");

      toast({
        title: "PDF Report Generated",
        description: `Colorful PDF report downloaded as ${filename}`,
      });
    } catch (error) {
      console.error("Colorful PDF generation error:", error);
      toast({
        title: "Error",
        description: `Failed to generate PDF report: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setDownloadType(null);
    }
  };

  if (chitLoading || drawsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading report data...</span>
      </div>
    );
  }

  if (!currentChit) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Chit Fund Found</h3>
          <p className="text-gray-600">
            Create a chit fund to generate reports
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Download Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Download Reports</CardTitle>
          <CardDescription>
            Generate and download chit fund reports in different formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => {
                console.log("Excel button clicked");
                generateExcelReport();
              }}
              disabled={isGenerating || !draws || draws.length === 0}
              className="flex items-center gap-2"
            >
              {isGenerating && downloadType === "excel" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              Download Excel Report
            </Button>

            <Button
              onClick={() => {
                console.log("PDF button clicked");
                generatePDFReport();
              }}
              disabled={isGenerating || !draws || draws.length === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isGenerating && downloadType === "pdf" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileImage className="h-4 w-4" />
              )}
              Download PDF Report
            </Button>

            {(!draws || draws.length === 0) && (
              <p className="text-sm text-gray-500 mt-2">
                No draws data available for report generation
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <div ref={reportRef} className="bg-white" data-report-root>
        <Card>
          <CardHeader className="text-center border-b">
            <CardTitle className="text-2xl">Chit Fund Report</CardTitle>
            <CardDescription className="text-lg">
              {currentChit.name} - Generated on{" "}
              {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <IndianRupee className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  ₹{currentChit.total_amount.toLocaleString()}
                </div>
                <div className="text-sm text-blue-600">Total Amount</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {currentChit.duration_months}
                </div>
                <div className="text-sm text-green-600">Duration (Months)</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Trophy className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {draws.filter((d) => d.status === "completed").length}
                </div>
                <div className="text-sm text-purple-600">Completed Draws</div>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">
                  {getMonthName(
                    currentChit.current_month || 1,
                    currentChit.start_date
                  )}
                </div>
                <div className="text-sm text-orange-600">Current Month</div>
              </div>
            </div>

            {/* Draws Table */}
            <div className="overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4">
                Monthly Draws Details
              </h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-3 text-left font-semibold">
                      Month
                    </th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">
                      Date
                    </th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">
                      Status
                    </th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">
                      Winner
                    </th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">
                      Participants
                    </th>
                    <th className="border border-gray-300 p-3 text-right font-semibold">
                      Payout (₹)
                    </th>
                    <th className="border border-gray-300 p-3 text-right font-semibold">
                      Benefit (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {draws.map((draw) => (
                    <tr key={draw.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3">
                        {getMonthName(
                          draw.month_number,
                          currentChit.start_date
                        )}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {new Date(draw.draw_date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 p-3">
                        <Badge
                          variant={
                            draw.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {draw.status}
                        </Badge>
                      </td>
                      <td className="border border-gray-300 p-3">
                        {draw.winner_name || "Not Declared"}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {draw.participants?.join(", ") || "None"}
                      </td>
                      <td className="border border-gray-300 p-3 text-right">
                        {draw.payout_amount.toLocaleString()}
                      </td>
                      <td
                        className={`border border-gray-300 p-3 text-right ${
                          draw.benefit_amount < 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {draw.benefit_amount > 0 ? "+" : ""}
                        {draw.benefit_amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Footer */}
            <div className="mt-8 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Total Draws:</strong> {draws.length}
                </div>
                <div>
                  <strong>Completed:</strong>{" "}
                  {draws.filter((d) => d.status === "completed").length}
                </div>
                <div>
                  <strong>Total Payout:</strong> ₹
                  {draws
                    .reduce((sum, d) => sum + d.payout_amount, 0)
                    .toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
