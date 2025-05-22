"use client";

import { BlogOutlineData, OutlineSection } from '@/services/api';

interface OutlineDisplayProps {
  outline: BlogOutlineData | null;
}

export default function OutlineDisplay({ outline }: OutlineDisplayProps) {
  if (!outline) {
    return null; // Or a placeholder if you prefer
  }

  const handleExportJson = () => {
    if (!outline) return;

    const filename = `${outline.title_suggestion.toLowerCase().replace(/\s+/g, '_') || 'blog'}_outline.json`;
    const jsonString = JSON.stringify(outline, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const formatOutlineToMarkdown = (outlineData: BlogOutlineData): string => {
    if (!outlineData) return "";
    let md = "";

    if (outlineData.title_suggestion) {
      md += `# ${outlineData.title_suggestion}\n\n`;
    }

    if (outlineData.introduction_hook) {
      md += `## Introduction\n${outlineData.introduction_hook}\n\n`;
    }

    if (outlineData.sections && outlineData.sections.length > 0) {
      outlineData.sections.forEach((section) => {
        md += `## ${section.heading}\n`;
        if (section.key_points && section.key_points.length > 0) {
          section.key_points.forEach((point) => {
            md += `- ${point}\n`;
          });
        }
        md += "\n"; // Extra newline after each section's points
      });
    }

    if (outlineData.conclusion_summary) {
      md += `## Conclusion\n${outlineData.conclusion_summary}\n\n`;
    }

    if (outlineData.call_to_action) {
      md += `### Call to Action\n${outlineData.call_to_action}\n`;
    }

    return md;
  };

  const handleExportMarkdown = () => {
    if (!outline) return;

    const filename = `${outline.title_suggestion.toLowerCase().replace(/\s+/g, '_') || 'blog'}_outline.md`;
    const markdownString = formatOutlineToMarkdown(outline);
    const blob = new Blob([markdownString], { type: 'text/markdown' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <div className="space-y-6 text-gray-800 dark:text-gray-200">
      {/* Export Buttons */}
      <div className="flex space-x-4 mt-4 mb-6 justify-center">
        <button
          onClick={handleExportJson}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
        >
          Export Outline as JSON
        </button>
        <button
          onClick={handleExportMarkdown}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
        >
          Export Outline as Markdown
        </button>
      </div>
      
      {/* Title Suggestion */}
      {outline.title_suggestion && (
        <h2 className="text-2xl font-bold text-center text-indigo-700 dark:text-indigo-400 pt-4"> {/* Added pt-4 for spacing */}
          {outline.title_suggestion}
        </h2>
      )}

      {/* Introduction */}
      {outline.introduction_hook && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Introduction
          </h3>
          <p className="text-base">{outline.introduction_hook}</p>
        </div>
      )}

      {/* Sections */}
      {outline.sections && outline.sections.length > 0 && (
        <div className="space-y-4">
          {outline.sections.map((section: OutlineSection, index: number) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                {index + 1}. {section.heading}
              </h3>
              {section.key_points && section.key_points.length > 0 && (
                <ul className="list-disc list-inside space-y-1 pl-4">
                  {section.key_points.map((point: string, pointIndex: number) => (
                    <li key={pointIndex} className="text-base">
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Conclusion */}
      {outline.conclusion_summary && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Conclusion
          </h3>
          <p className="text-base">{outline.conclusion_summary}</p>
        </div>
      )}

      {/* Call to Action */}
      {outline.call_to_action && (
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg shadow mt-6">
          <h3 className="text-lg font-semibold mb-2 text-indigo-700 dark:text-indigo-400">
            Call to Action
          </h3>
          <p className="text-base text-indigo-600 dark:text-indigo-300">
            {outline.call_to_action}
          </p>
        </div>
      )}
    </div>
  );
}
