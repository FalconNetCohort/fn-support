import { Node } from "@tiptap/core";

export const Attachment = Node.create({
    name: "attachment",
    group: "block",
    atom: true,

    addAttributes() {
        return {
            fileUrl: { default: null },
        };
    },

    parseHTML() {
        return [{ tag: "attachment-card" }];
    },

    renderHTML({ node }) {
        return ["attachment-card", { "data-url": node.attrs.fileUrl }];
    },

    addNodeView() {
        return ({ node }) => {
            const container = document.createElement("div");
            container.className = "attachment-container";
            container.style.display = "flex";
            container.style.alignItems = "center";
            container.style.padding = "8px";
            container.style.border = "1px solid gray";
            container.style.borderRadius = "8px";
            container.style.backgroundColor = "#222";
            container.style.color = "#fff";
            container.style.width = "fit-content";
            container.style.margin = "8px 0";

            const fileUrl = node.attrs.fileUrl;
            const decodedUrl = decodeURIComponent(fileUrl); // Decode URL encoding
            const fileName = decodedUrl.split("/").pop()?.split("?")[0] || "Unknown File";

            // Remove timestamp (assumes format: guideAttachments/{timestamp}-{fileName})
            const cleanedFileName = fileName.replace(/^guideAttachments\//, "");

            const icon = document.createElement("span");
            icon.style.fontSize = "1.5rem";
            icon.innerText = "📎";

            const link = document.createElement("a");
            link.href = fileUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.innerText = cleanedFileName;
            link.style.color = "#fff";
            link.style.fontWeight = "bold";
            link.style.textDecoration = "none";
            link.style.marginLeft = "8px";

            container.appendChild(icon);
            container.appendChild(link);

            return {
                dom: container,
            };
        };
    },
});
