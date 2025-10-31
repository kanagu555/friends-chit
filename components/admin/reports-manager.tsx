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
  Hourglass,
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
          Value: currentChit?.total_amount?.toLocaleString("en-IN") || "N/A",
        },
        {
          Metric: "Monthly Payment",
          Value: currentChit?.monthly_payment?.toLocaleString("en-IN") || "N/A",
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
            .toLocaleString("en-IN"),
        },
        {
          Metric: "Report Generated",
          Value: new Date().toLocaleString("en-IN"),
        },
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
      const jsPDFModule = await import("jspdf");
      const pdf = new jsPDFModule.jsPDF("p", "mm", "a4");

      const brand = {
        primary: [17, 24, 39] as [number, number, number],
        accent: [37, 99, 235] as [number, number, number],
        subtle: [107, 114, 128] as [number, number, number],
        line: [229, 231, 235] as [number, number, number],
        green: [34, 197, 94] as [number, number, number],
        red: [239, 68, 68] as [number, number, number],
        orange: [245, 158, 11] as [number, number, number],
      };

      let y = 18;

      // Cover header band
      pdf.setFillColor(...brand.accent);
      pdf.rect(0, 0, 210, 30, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("Friend's Chit Fund Report", 14, 18);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(`${currentChit?.name || "N/A"}`, 14, 24);
      pdf.text(
        `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        150,
        24
      );

      y = 40;

      // Summary tiles (2 columns)
      const totalDraws = draws.length;
      const completedDraws = draws.filter(
        (d) => d.status === "completed"
      ).length;
      const pendingDraws = draws.filter((d) => d.status === "pending").length;
      const tiles = [
        {
          label: "Total Amount",
          value: `INR ${
            currentChit?.total_amount?.toLocaleString("en-IN") || "N/A"
          }`,
        },
        {
          label: "Monthly Payment",
          value: `INR ${
            currentChit?.monthly_payment?.toLocaleString("en-IN") || "N/A"
          }`,
        },
        {
          label: "Duration",
          value: `${currentChit?.duration_months || "N/A"} months`,
        },
        { label: "Total Draws", value: `${totalDraws}` },
        { label: "Completed Draws", value: `${completedDraws}` },
        { label: "Pending Draws", value: `${pendingDraws}` },
      ];
      const tileWidth = 90;
      const tileHeight = 18;
      const tileGap = 10;
      const tilesPerRow = 2;
      const tileBg = (idx: number): [number, number, number] => {
        // soft tinted backgrounds corresponding to content
        switch (idx) {
          case 0: // Total Amount
            return [239, 246, 255]; // light blue
          case 1: // Monthly Payment
            return [240, 253, 244]; // light green
          case 2: // Duration
            return [243, 244, 246]; // neutral light gray
          case 3: // Current Month (if present)
            return [255, 247, 237]; // light orange
          case 4: // Total Draws
            return [243, 244, 246];
          case 5: // Completed Draws
            return [240, 253, 244];
          case 6: // Pending Draws
            return [255, 247, 237];
          default:
            return [250, 250, 250];
        }
      };

      const tileValueColor = (idx: number): [number, number, number] => {
        switch (idx) {
          case 0:
            return brand.accent;
          case 1:
            return brand.green;
          case 5:
            return brand.green;
          case 6:
            return brand.orange;
          default:
            return brand.accent;
        }
      };

      tiles.forEach((t, i) => {
        const col = i % tilesPerRow;
        const row = Math.floor(i / tilesPerRow);
        const x = 14 + col * (tileWidth + tileGap);
        const ty = y + row * (tileHeight + 6);
        const bg = tileBg(i);
        pdf.setDrawColor(...brand.line);
        pdf.setFillColor(bg[0], bg[1], bg[2]);
        pdf.rect(x, ty, tileWidth, tileHeight, "F");
        pdf.rect(x, ty, tileWidth, tileHeight, "S");
        pdf.setTextColor(...brand.subtle);
        pdf.setFontSize(8);
        pdf.text(t.label, x + 4, ty + 7);
        const vc = tileValueColor(i);
        pdf.setTextColor(vc[0], vc[1], vc[2]);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.text(t.value, x + 4, ty + 14);
        pdf.setFont("helvetica", "normal");
      });

      const rows = Math.ceil(tiles.length / tilesPerRow);
      y += rows * (tileHeight + 6) + 10;

      // Section title
      pdf.setTextColor(...brand.primary);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("Monthly Draws", 14, y);
      y += 6;

      // Table header
      const headers = [
        "Month",
        "Date",
        "Status",
        "Winner",
        "Participants",
        "Payout",
      ];
      // Column x-positions: tighten Winner→Participants gap as well
      const colX = [14, 35, 65, 90, 125, 193];
      pdf.setDrawColor(...brand.line);
      pdf.line(14, y, 196, y);
      y += 6;
      pdf.setTextColor(...brand.subtle);
      pdf.setFontSize(9);
      headers.forEach((h, idx) => {
        const alignRight = idx === 5;
        pdf.text(h, colX[idx], y, {
          align: alignRight ? "right" : "left",
        } as any);
      });
      y += 4;
      pdf.setDrawColor(...brand.line);
      pdf.line(14, y, 196, y);
      y += 4;

      // Table rows
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      const rowHeight = 8;
      const addFooter = () => {
        // separator line
        pdf.setDrawColor(...brand.line);
        pdf.line(14, 282, 196, 282);

        // footer texts
        pdf.setTextColor(...brand.subtle);
        pdf.setFontSize(8);
        const sysName = `Generated by Friend's Chit Fund Management System`;
        pdf.text(sysName, 14, 287);

        const page = (pdf as any).internal.getNumberOfPages();
        pdf.text(`Page ${page}`, 196, 287, { align: "right" });

        // secondary line
        pdf.setFontSize(7);
        const disclaimer = `Confidential – for internal use only • ${new Date().toLocaleDateString(
          "en-IN"
        )}`;
        pdf.text(disclaimer, 14, 291);
      };

      draws.forEach((draw, idx) => {
        // Prepare participants text wrapping
        const participantsNames =
          draw.participants && draw.participants.length > 0
            ? draw.participants.join(", ")
            : "None";
        const availableWidth = colX[5] - colX[4] - 8; // space before payout
        const participantLines = pdf.splitTextToSize(
          participantsNames,
          availableWidth
        );
        const bottomPadding = participantLines.length > 1 ? 3 : 0;
        const dynamicRowHeight =
          Math.max(rowHeight, participantLines.length * 5) + bottomPadding;

        if (y + dynamicRowHeight > 270) {
          addFooter();
          pdf.addPage();
          y = 20;
          // repeat header row
          pdf.setTextColor(...brand.subtle);
          pdf.setFontSize(9);
          headers.forEach((h, cidx) => {
            const alignRight = cidx === 5;
            pdf.text(h, colX[cidx], y, {
              align: alignRight ? "right" : "left",
            } as any);
          });
          y += 4;
          pdf.setDrawColor(...brand.line);
          pdf.line(14, y, 196, y);
          y += 4;
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(9);
        }

        if (idx % 2 === 0) {
          pdf.setFillColor(249, 250, 251);
          pdf.rect(14, y - 5, 182, dynamicRowHeight, "F");
        }

        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(9);
        pdf.text(
          getMonthName(draw.month_number, currentChit?.start_date),
          colX[0],
          y
        );
        pdf.text(new Date(draw.draw_date).toLocaleDateString(), colX[1], y);
        const status = draw.status.toUpperCase();
        const statusColor =
          draw.status === "completed"
            ? brand.green
            : draw.status === "pending"
            ? ([245, 158, 11] as any)
            : brand.subtle;
        pdf.setTextColor(...(statusColor as [number, number, number]));
        pdf.text(status, colX[2], y);
        pdf.setTextColor(0, 0, 0);
        const winner = (draw.winner_name || "Not Declared").slice(0, 22);
        pdf.text(winner, colX[3], y);
        // Draw wrapped participant names line by line
        participantLines.forEach((line: string, li: number) => {
          const ly = y + li * 5;
          pdf.text(line, colX[4], ly);
        });
        pdf.setTextColor(...brand.green);
        pdf.text(draw.payout_amount.toLocaleString("en-IN"), colX[5], y, {
          align: "right",
        });
        pdf.setTextColor(0, 0, 0);

        y += dynamicRowHeight;
      });

      addFooter();

      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `Chit_Fund_Report_${timestamp}.pdf`;
      pdf.save(filename);

      toast({
        title: "PDF Report Generated",
        description: `Report downloaded as ${filename}`,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
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
            <CardTitle className="text-2xl">
              Friend's Chit Fund Report
            </CardTitle>
            <CardDescription className="text-lg">
              {currentChit.name} - Generated on{" "}
              {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <IndianRupee className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  ₹{currentChit.total_amount.toLocaleString("en-IN")}
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

              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Hourglass className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">
                  {draws.filter((d) => d.status === "pending").length}
                </div>
                <div className="text-sm text-yellow-600">Pending Draws</div>
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
                        {draw.payout_amount.toLocaleString("en-IN")}
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
                  <strong>
                    Generated by Friend's Chit Fund Management System
                  </strong>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
