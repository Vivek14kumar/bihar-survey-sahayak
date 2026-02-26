import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

/* ---------------- FONT ---------------- */

Font.register({
  family: "Hindi",
  src: "/fonts/NotoSansDevanagari-Regular.ttf",
});

/* ---------------- CONSTANTS ---------------- */

const PAGE_WIDTH = 842; // A4 landscape
const NODE_W = 110;
const NODE_H = 55;
const LEVEL_GAP = 90;
const SIDE_PADDING = 40;
const MAX_MEMBERS = 50;

/* ---------------- BUILD LEVELS FROM TREE ---------------- */

function buildLevels(root) {
  const levels = [];
  let count = 0;

  function traverse(node, depth = 0) {
    if (!node || count >= MAX_MEMBERS) return;

    if (!levels[depth]) levels[depth] = [];
    levels[depth].push(node);
    count++;

    node.children?.forEach((child) => {
      traverse(child, depth + 1);
    });
  }

  traverse(root);
  return levels;
}

/* ---------------- POSITION CALCULATOR ---------------- */

function calculatePositions(levels) {
  const positioned = [];

  levels.forEach((nodes, levelIndex) => {
    const count = nodes.length;

    if (levelIndex === 0) {
      positioned.push({
        node: nodes[0],
        x: PAGE_WIDTH / 2 - NODE_W / 2,
        y: 80,
      });
      return;
    }

    const usableWidth = PAGE_WIDTH - SIDE_PADDING * 2;

    const gap =
      count > 1
        ? (usableWidth - count * NODE_W) / (count - 1)
        : 0;

    nodes.forEach((node, i) => {
      positioned.push({
        node,
        x: SIDE_PADDING + i * (NODE_W + gap),
        y: 80 + levelIndex * LEVEL_GAP,
      });
    });
  });

  return positioned;
}

/* ---------------- CONNECTOR LINES ---------------- */

function buildLines(nodes) {
  const lines = [];

  nodes.forEach((parent) => {
    parent.node.children?.forEach((child) => {
      const childNode = nodes.find((n) => n.node === child);
      if (!childNode) return;

      const parentCenterX = parent.x + NODE_W / 2;
      const parentBottomY = parent.y + NODE_H;

      const childCenterX = childNode.x + NODE_W / 2;
      const childTopY = childNode.y;

      const midY = parentBottomY + 20;

      // vertical down
      lines.push({
        type: "v",
        x: parentCenterX,
        y: parentBottomY,
        h: 20,
      });

      // horizontal
      lines.push({
        type: "h",
        x: Math.min(parentCenterX, childCenterX),
        y: midY,
        w: Math.abs(childCenterX - parentCenterX),
      });

      // vertical to child
      lines.push({
        type: "v",
        x: childCenterX,
        y: midY,
        h: childTopY - midY,
      });
    });
  });

  return lines;
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  page: {
    fontFamily: "Hindi",
    fontSize: 9,
    padding: 20,
    position: "relative",
  },

  title: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 15,
    textDecoration: "underline",
    zIndex: 10,
  },

  node: {
    position: "absolute",
    width: NODE_W,
    height: NODE_H,
    border: "1 solid black",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: "white", // Important: node sits above watermark
    zIndex: 5,
  },

  vLine: {
    position: "absolute",
    width: 1,
    backgroundColor: "black",
    zIndex: 2,
  },

  hLine: {
    position: "absolute",
    height: 1,
    backgroundColor: "black",
    zIndex: 2,
  },

  footer: {
    position: "absolute",
    bottom: 15,
    width: "100%",
    textAlign: "center",
    fontSize: 8,
    color: "gray",
    zIndex: 10,
  },

  /* FULL PAGE WATERMARK */
  watermarkContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50,
    opacity: 0.1, // Adjust transparency as needed
    zIndex: -1,   // Background layer
  },
  watermarkText: {
    fontSize: 35,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
});

/* ---------------- MAIN COMPONENT ---------------- */

export default function AutoFamilyTreePDF({ data, isPreview = false }) {

  // 🔒 SAFETY CHECK
  if (!data || typeof data !== "object") {
    return (
      <Document>
        <Page size="A4" orientation="landscape">
          <Text>डेटा उपलब्ध नहीं है</Text>
        </Page>
      </Document>
    );
  }

  const levels = buildLevels(data);
  const positionedNodes = calculatePositions(levels);
  const lines = buildLines(positionedNodes);

  // Watermark text rows
  const watermarkLabel = "BIHAR SURVEY SAHAYAK BIHAR SURVEY SAHAYAK BIHAR SURVEY SAHAYAK";

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        
        {/* REPEATED WATERMARK */}
        {isPreview && (
          <View style={styles.watermarkContainer} fixed>
            <Text style={styles.watermarkText}>{watermarkLabel}</Text>
            <Text style={styles.watermarkText}>{watermarkLabel}</Text>
            <Text style={styles.watermarkText}>{watermarkLabel}</Text>
            <Text style={styles.watermarkText}>{watermarkLabel}</Text>
            <Text style={styles.watermarkText}>{watermarkLabel}</Text>
            <Text style={styles.watermarkText}>{watermarkLabel}</Text>
          </View>
        )}

        <Text style={styles.title}>
          वंशवृक्ष तालिका (स्व-घोषणा)
        </Text>

        {/* Lines */}
        {lines.map((l, i) =>
          l.type === "v" ? (
            <View
              key={`v-${i}`}
              style={[styles.vLine, { left: l.x, top: l.y, height: l.h }]}
            />
          ) : (
            <View
              key={`h-${i}`}
              style={[styles.hLine, { left: l.x, top: l.y, width: l.w }]}
            />
          )
        )}

        {/* Nodes */}
        {positionedNodes.map((n, i) => (
          <View
            key={i}
            style={[styles.node, { left: n.x, top: n.y }]}
          >
            <Text>
              {n.node.name}
              {n.node.dead ? " (मृतक)" : ""}
            </Text>

            {n.node.spouse && (
              <Text style={{ fontSize: 8, marginTop: 4 }}>
                पत्नी: {n.node.spouse.name}
              </Text>
            )}
          </View>
        ))}

        <Text style={styles.footer}>
          यह वंशावली स्व-घोषणा पर आधारित है। यह सरकारी प्रमाण-पत्र नहीं है।
        </Text>
      </Page>
    </Document>
  );
}