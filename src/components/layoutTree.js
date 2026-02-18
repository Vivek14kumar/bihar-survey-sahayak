const NODE_W = 90;
const NODE_H = 30;
const H_GAP = 30;
const V_GAP = 70;

export function layoutTree(node, depth = 0) {
  let children = [];
  let width = NODE_W;

  if (node.children && node.children.length > 0) {
    children = node.children.map((child) =>
      layoutTree(child, depth + 1)
    );

    const childrenWidth =
      children.reduce((sum, c) => sum + c.width, 0) +
      H_GAP * (children.length - 1);

    width = Math.max(childrenWidth, NODE_W);

    let startX = (width - childrenWidth) / 2;

    children = children.map((c) => {
      const updated = {
        ...c,
        x: startX + c.width / 2 - NODE_W / 2,
      };
      startX += c.width + H_GAP;
      return updated;
    });
  }

  return {
    node,
    depth,
    x: width / 2 - NODE_W / 2,
    y: depth * (NODE_H + V_GAP),
    width,
    children,
  };
}
