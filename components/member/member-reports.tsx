"use client";

import { useState } from "react";
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
import { useChitParticipants } from "@/hooks/use-chit-participants";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  FileImage,
  FileSpreadsheet,
  Loader2,
  Calendar,
  IndianRupee,
  Trophy,
  Users,
  Download,
} from "lucide-react";
import { getMonthName } from "@/lib/month-utils";

export function MemberReports() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadType, setDownloadType] = useState<"excel" | "pdf" | null>(
    null
  );
  const { toast } = useToast();
  const { user } = useAuth();

  // Get current chit fund data
  const { chitFunds, loading: chitLoading } = useChitFunds();
  const currentChit =
    chitFunds.find((chit) => chit.status === "active") || chitFunds[0];

  // Get draws data
  const { draws, loading: drawsLoading } = useChitDraws(
    currentChit?.id,
    currentChit?.current_month || 1
  );

  // Get participants data
  const { participants, loading: participantsLoading } = useChitParticipants(
    currentChit?.id
  );

  // Find current user's participant record
  const currentUserParticipant = participants.find(
    (p) => p.member_email === user?.email
  );

  // Get member name and email - use participant data if available, otherwise use auth user
  const memberName =
    currentUserParticipant?.member_name ||
    user?.email?.split("@")[0] ||
    "Member";
  const memberEmail =
    currentUserParticipant?.member_email || user?.email || "N/A";

  // Calculate member-specific data
  const memberDraws = draws.map((draw) => {
    const isWinner =
      draw.winner_name &&
      (draw.winner_name === currentUserParticipant?.member_name ||
        draw.winner_participant_id === currentUserParticipant?.id);

    return {
      ...draw,
      isWinner,
      participatedIn:
        draw.participants?.includes(
          currentUserParticipant?.member_name || ""
        ) || false,
    };
  });

  const totalWinnings = memberDraws
    .filter((d) => d.isWinner && d.status === "completed")
    .reduce((sum, d) => sum + d.payout_amount, 0);

  const generateExcelReport = async () => {
    try {
      setIsGenerating(true);
      setDownloadType("excel");

      console.log("Starting Excel generation...");

      if (!draws || draws.length === 0) {
        throw new Error("No draws data available");
      }

      const XLSX = await import("xlsx");

      // Prepare member-specific data for Excel
      const reportData = memberDraws.map((draw, index) => ({
        "S.No": index + 1,
        Month: getMonthName(draw.month_number, currentChit?.start_date),
        "Draw Date": new Date(draw.draw_date).toLocaleDateString(),
        Status: draw.status,
        Winner: draw.winner_name || "Not Declared",
        "You Won": draw.isWinner ? "Yes" : "No",
        "You Participated": draw.participatedIn ? "Yes" : "No",
        "Payout Amount": draw.payout_amount,
        "Benefit Amount": draw.benefit_amount,
        Participants: draw.participants?.length || 0,
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(reportData);

      const colWidths = [
        { wch: 8 }, // S.No
        { wch: 15 }, // Month
        { wch: 12 }, // Draw Date
        { wch: 12 }, // Status
        { wch: 20 }, // Winner
        { wch: 10 }, // You Won
        { wch: 15 }, // You Participated
        { wch: 18 }, // Payout Amount
        { wch: 18 }, // Benefit Amount
        { wch: 15 }, // Participants
      ];
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "My Chit Fund Report");

      // Create personal summary sheet
      const summaryData = [
        {
          Metric: "Member Name",
          Value: memberName,
        },
        {
          Metric: "Member Email",
          Value: memberEmail,
        },
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
        { Metric: "Current Month", Value: currentChit?.current_month || "N/A" },
        {
          Metric: "Total Paid",
          Value: currentUserParticipant?.total_paid?.toLocaleString() || "0",
        },
        { Metric: "Total Winnings", Value: totalWinnings.toLocaleString() },
        {
          Metric: "Net Position",
          Value: (
            totalWinnings - (currentUserParticipant?.total_paid || 0)
          ).toLocaleString(),
        },
        {
          Metric: "Draws Participated",
          Value: memberDraws.filter((d) => d.participatedIn).length,
        },
        {
          Metric: "Draws Won",
          Value: memberDraws.filter(
            (d) => d.isWinner && d.status === "completed"
          ).length,
        },
        { Metric: "Report Generated", Value: new Date().toLocaleString() },
      ];

      const summaryWs = XLSX.utils.json_to_sheet(summaryData);
      summaryWs["!cols"] = [{ wch: 25 }, { wch: 30 }];
      XLSX.utils.book_append_sheet(wb, summaryWs, "My Summary");

      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `My_Chit_Fund_Report_${timestamp}.xlsx`;

      XLSX.writeFile(wb, filename);

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

      console.log("Generating member PDF report...");

      const jsPDFModule = await import("jspdf");
      const pdf = new jsPDFModule.jsPDF("p", "mm", "a4");

      const colors = {
        primary: [37, 99, 235] as [number, number, number],
        secondary: [107, 114, 128] as [number, number, number],
        success: [34, 197, 94] as [number, number, number],
        warning: [245, 158, 11] as [number, number, number],
        danger: [239, 68, 68] as [number, number, number],
        white: [255, 255, 255] as [number, number, number],
        lightBlue: [239, 246, 255] as [number, number, number],
        darkBlue: [30, 64, 175] as [number, number, number],
        yellow: [255, 193, 7] as [number, number, number],
      };

      let yPos = 20;

      // Header
      pdf.setFillColor(...colors.primary);
      pdf.rect(0, 0, 210, 40, "F");

      pdf.setTextColor(...colors.white);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("MY CHIT FUND REPORT", 105, 20, { align: "center" });

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${currentChit?.name || "N/A"}`, 105, 30, { align: "center" });

      yPos = 50;

      // Member Info Box
      pdf.setFillColor(...colors.lightBlue);
      pdf.rect(15, yPos, 180, 25, "F");
      pdf.setDrawColor(...colors.primary);
      pdf.rect(15, yPos, 180, 25, "S");

      pdf.setTextColor(...colors.darkBlue);
      pdf.setFontSize(10);
      pdf.text(`Member: ${memberName}`, 20, yPos + 8);
      pdf.text(`Email: ${memberEmail}`, 20, yPos + 15);
      pdf.text(
        `Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
        20,
        yPos + 22
      );

      yPos += 40;

      // Personal Statistics
      pdf.setTextColor(...colors.primary);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");

      // Draws Table
      pdf.setTextColor(...colors.primary);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("MY DRAW HISTORY", 20, yPos);
      yPos += 15;

      const tableHeaders = [
        { text: "Month", x: 20 },
        { text: "Date", x: 50 },
        { text: "Winner", x: 80 },
        { text: "Won", x: 120 },
        { text: "Participated", x: 140 },
        { text: "Payout", x: 175 },
      ];

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

      memberDraws.forEach((draw, index) => {
        if (yPos > 260) {
          pdf.addPage();
          yPos = 30;

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

        if (index % 2 === 0) {
          pdf.setFillColor(248, 250, 252);
          pdf.rect(15, yPos - 3, 180, 10, "F");
        }

        pdf.setDrawColor(200, 200, 200);
        pdf.rect(15, yPos - 3, 180, 10, "S");

        pdf.setTextColor(0, 0, 0);
        pdf.text(`M${draw.month_number}`, 20, yPos + 2);
        pdf.text(new Date(draw.draw_date).toLocaleDateString(), 50, yPos + 2);

        const winnerText = draw.winner_name || "Not Declared";
        pdf.text(
          winnerText.length > 15
            ? winnerText.substring(0, 12) + "..."
            : winnerText,
          80,
          yPos + 2
        );

        if (draw.isWinner) {
          pdf.setTextColor(...colors.success);
          pdf.text("YES", 120, yPos + 2);
        } else {
          pdf.setTextColor(...colors.secondary);
          pdf.text("No", 120, yPos + 2);
        }

        pdf.setTextColor(0, 0, 0);
        pdf.text(draw.participatedIn ? "Yes" : "No", 140, yPos + 2);

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

      pdf.setFillColor(...colors.lightBlue);
      pdf.rect(15, yPos, 180, 20, "F");
      pdf.setDrawColor(...colors.primary);
      pdf.rect(15, yPos, 180, 20, "S");

      pdf.setTextColor(...colors.primary);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("REPORT SUMMARY", 20, yPos + 8);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.text(`Personal report for ${memberName}`, 20, yPos + 15);

      const pageCount = (pdf as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setTextColor(...colors.secondary);
        pdf.setFontSize(8);
        pdf.text(`Page ${i} of ${pageCount}`, 190, 285, { align: "right" });
      }

      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `My_Chit_Fund_Report_${timestamp}.pdf`;

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

  if (chitLoading || drawsLoading || participantsLoading) {
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
            You are not participating in any chit fund yet
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
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download My Reports
          </CardTitle>
          <CardDescription>
            Generate and download your personal chit fund reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={generateExcelReport}
              disabled={isGenerating || !draws || draws.length === 0}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 cursor-pointer"
            >
              {isGenerating && downloadType === "excel" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              Download Excel Report
            </Button>

            <Button
              onClick={generatePDFReport}
              disabled={isGenerating || !draws || draws.length === 0}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white cursor-pointer"
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
      <Card>
        <CardHeader className="text-center border-b">
          <CardTitle className="text-2xl">My Chit Fund Report</CardTitle>
          <CardDescription className="text-lg">
            {currentChit.name} - Generated on {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Draws Table */}
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">My Draw History</h3>
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
                    Winner
                  </th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">
                    I Won
                  </th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">
                    I Participated
                  </th>
                  <th className="border border-gray-300 p-3 text-right font-semibold">
                    Payout (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {memberDraws.map((draw) => (
                  <tr key={draw.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3">
                      {getMonthName(draw.month_number, currentChit.start_date)}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {new Date(draw.draw_date).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {draw.winner_name || "Not Declared"}
                    </td>
                    <td className="border border-gray-300 p-3 text-center">
                      {draw.isWinner && draw.status === "completed" ? (
                        <Badge className="bg-green-100 text-green-800">
                          🎉 Yes
                        </Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </td>
                    <td className="border border-gray-300 p-3 text-center">
                      {draw.participatedIn ? (
                        <Badge variant="outline">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </td>
                    <td className="border border-gray-300 p-3 text-right">
                      {draw.payout_amount.toLocaleString()}
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
                <strong>Draws I Participated:</strong>{" "}
                {memberDraws.filter((d) => d.participatedIn).length}
              </div>
              <div>
                <strong>Draws I Won:</strong>{" "}
                {
                  memberDraws.filter(
                    (d) => d.isWinner && d.status === "completed"
                  ).length
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
