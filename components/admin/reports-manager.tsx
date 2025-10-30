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
  const [downloadType, setDownloadType] = useState<"excel" | "image" | null>(
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

  const generateImageReport = async () => {
    try {
      setIsGenerating(true);
      setDownloadType("image");

      console.log("Starting PDF generation...");

      if (!reportRef.current) {
        throw new Error("Report element not found");
      }

      console.log("Report element found:", reportRef.current);

      // Dynamic imports to avoid SSR issues
      const html2canvas = await import("html2canvas");
      const jsPDFModule = await import("jspdf");

      console.log("Libraries loaded:", !!html2canvas, !!jsPDFModule);

      // Generate canvas from the report element
      const canvas = await html2canvas.default(reportRef.current, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: reportRef.current.scrollWidth,
        height: reportRef.current.scrollHeight,
        ignoreElements: (element) => {
          // Skip elements that might have unsupported CSS
          return element.tagName === "SCRIPT" || element.tagName === "STYLE";
        },
        onclone: (clonedDoc) => {
          // Fix any lab() color functions in the cloned document
          const style = clonedDoc.createElement("style");
          style.textContent = `
            * {
              color: rgb(0, 0, 0) !important;
              background-color: rgb(255, 255, 255) !important;
              border-color: rgb(200, 200, 200) !important;
            }
            .bg-blue-50 { background-color: rgb(239, 246, 255) !important; }
            .bg-green-50 { background-color: rgb(240, 253, 244) !important; }
            .bg-purple-50 { background-color: rgb(250, 245, 255) !important; }
            .bg-orange-50 { background-color: rgb(255, 247, 237) !important; }
            .bg-gray-100 { background-color: rgb(243, 244, 246) !important; }
            .text-blue-600 { color: rgb(37, 99, 235) !important; }
            .text-green-600 { color: rgb(22, 163, 74) !important; }
            .text-purple-600 { color: rgb(147, 51, 234) !important; }
            .text-orange-600 { color: rgb(234, 88, 12) !important; }
            .text-red-600 { color: rgb(220, 38, 38) !important; }
            .border-gray-300 { border-color: rgb(209, 213, 219) !important; }
          `;
          clonedDoc.head.appendChild(style);
        },
      });

      console.log("Canvas generated:", canvas.width, "x", canvas.height);

      // Create PDF
      const pdf = new jsPDFModule.jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      console.log("Adding image to PDF...");

      // Add image to PDF
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `Chit_Fund_Report_${timestamp}.pdf`;

      console.log("Saving PDF:", filename);

      // Download PDF
      pdf.save(filename);

      console.log("PDF download initiated");

      toast({
        title: "PDF Report Generated",
        description: `Report downloaded as ${filename}`,
      });
    } catch (error) {
      console.error("PDF generation error:", error);

      // If html2canvas fails, try text-based PDF
      if (error instanceof Error && error.message.includes("lab")) {
        console.log("Detected lab() color issue, trying text-based PDF...");
        try {
          await generateTextPDF();
          return;
        } catch (textError) {
          console.error("Text PDF also failed:", textError);
        }
      }

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

  const generateTextPDF = async () => {
    try {
      console.log("Generating text-based PDF...");

      const jsPDFModule = await import("jspdf");
      const pdf = new jsPDFModule.jsPDF("p", "mm", "a4");

      // Add title
      pdf.setFontSize(20);
      pdf.text("Chit Fund Report", 20, 30);

      pdf.setFontSize(12);
      pdf.text(`${currentChit?.name || "N/A"}`, 20, 45);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 55);

      // Add summary
      let yPos = 75;
      pdf.setFontSize(14);
      pdf.text("Summary", 20, yPos);
      yPos += 10;

      pdf.setFontSize(10);
      const summaryItems = [
        `Total Amount: ₹${
          currentChit?.total_amount?.toLocaleString() || "N/A"
        }`,
        `Monthly Payment: ₹${
          currentChit?.monthly_payment?.toLocaleString() || "N/A"
        }`,
        `Duration: ${currentChit?.duration_months || "N/A"} months`,
        `Current Month: ${currentChit?.current_month || "N/A"}`,
        `Total Draws: ${draws.length}`,
        `Completed: ${draws.filter((d) => d.status === "completed").length}`,
        `Pending: ${draws.filter((d) => d.status === "pending").length}`,
      ];

      summaryItems.forEach((item) => {
        pdf.text(item, 20, yPos);
        yPos += 8;
      });

      // Add draws table
      yPos += 10;
      pdf.setFontSize(14);
      pdf.text("Monthly Draws", 20, yPos);
      yPos += 15;

      pdf.setFontSize(9);
      // Table headers
      pdf.text("Month", 20, yPos);
      pdf.text("Date", 60, yPos);
      pdf.text("Status", 100, yPos);
      pdf.text("Winner", 130, yPos);
      pdf.text("Payout", 170, yPos);
      yPos += 8;

      // Table data
      draws.forEach((draw) => {
        if (yPos > 270) {
          // New page if needed
          pdf.addPage();
          yPos = 30;
        }

        pdf.text(
          getMonthName(draw.month_number, currentChit?.start_date),
          20,
          yPos
        );
        pdf.text(new Date(draw.draw_date).toLocaleDateString(), 60, yPos);
        pdf.text(draw.status, 100, yPos);
        pdf.text(draw.winner_name || "Not Declared", 130, yPos);
        pdf.text(`₹${draw.payout_amount.toLocaleString()}`, 170, yPos);
        yPos += 8;
      });

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `Chit_Fund_Report_Text_${timestamp}.pdf`;

      // Download PDF
      pdf.save(filename);

      console.log("Text PDF download initiated");

      toast({
        title: "PDF Report Generated",
        description: `Text-based PDF downloaded as ${filename}`,
      });
    } catch (error) {
      console.error("Text PDF generation error:", error);
      throw error;
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
                generateImageReport();
              }}
              disabled={isGenerating || !draws || draws.length === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isGenerating && downloadType === "image" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileImage className="h-4 w-4" />
              )}
              Download PDF Report
            </Button>

            <Button
              onClick={() => {
                console.log("Text PDF button clicked");
                generateTextPDF();
              }}
              disabled={isGenerating || !draws || draws.length === 0}
              variant="secondary"
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileImage className="h-4 w-4" />
              )}
              Download Text PDF
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
      <div ref={reportRef} className="bg-white">
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
