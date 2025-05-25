**In brief:** BIZBOK® uses a *capability card* (sometimes called a capability “profile”) as a one-page, highly structured artefact that names a capability, explains what value it delivers, and records the people, process, technology, metrics and maturity that describe how it works and how well it performs([iasa-global.github.io][1]).  Because capabilities are the “core” domain of Business Architecture and remain relatively stable over time, the card becomes the canonical place where architects, product teams and executives meet on common facts.  Below is (1) a condensed reference model for the card itself and (2) a step-by-step React-friendly algorithm that, given your `NodeData` graph, produces a responsive card that always shows the selected capability plus its children and grandchildren while filling whatever space the host component offers.

---

## 1  What goes into a BIZBOK-style capability card

| Section (logical order)           | Typical content                                                                                                                  | Mapping to your `NodeData`         |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **Capability Name**               | Verb–noun label (e.g. *Customer On-Boarding*)([Jibility][2])                                                                     | `name`                             |
| **Description / Purpose**         | 2-3 sentences that state business value and scope([iasa-global.github.io][1], [BusinessAnalystMentor.com][3])                    | `description`                      |
| **Outcomes**                      | Tangible deliverables; feeds later KPI selection([iasa-global.github.io][1])                                                     | *extend via extra field or lookup* |
| **Key Metrics**                   | A small balanced set; many teams borrow the Balanced-Scorecard lens (customer / process / learning / finance)([Investopedia][4]) | *extend*                           |
| **Source / Demand Driver**        | Event, regulation or OKR that creates the need([iasa-global.github.io][1])                                                       | *extend*                           |
| **People • Process • Technology** | Skills, critical process steps, enabling apps/services([iasa-global.github.io][1])                                               | *extend*                           |
| **Performance & Maturity**        | 1-to-5 (CMMI-style) rating across people, process, data, tech([Bizzdesign][5])                                                   | *extend*                           |
| **Strategy Alignment**            | Link to value-stream stage or strategic objective([Bizzdesign][6], [www.boc-group.com][7])                                       | *extend*                           |

*Why only those fields?*  A card should fit on a screen or sheet of A4, so BIZBOK recommends capturing the *minimum* set that lets architects evaluate strategic importance, current fitness and investment needs([Bizzdesign][5]).

---

## 2  Algorithm for building a *three-generation* capability card in React

### 2.1 Data preparation (O ≈ N)

```ts
type NodeData = { id: string; name: string; description: string; parent: string | null };

function buildIndex(nodes: NodeData[]) {
  const byId = new Map(nodes.map(n => [n.id, n]));
  const children = new Map<string, NodeData[]>();
  for (const n of nodes) {
    if (n.parent) children.set(n.parent, [...(children.get(n.parent) ?? []), n]);
  }
  return { byId, children };
}
```

*Explanation:* Indexing once avoids repeated tree walks when the user clicks around; this is the same approach used in most EA tooling when rendering capability maps([Bizzdesign][6]).

### 2.2 Selecting the display subset

```ts
function getCardSubtree(index, currentId: string) {
  const current = index.byId.get(currentId);
  const kids = index.children.get(currentId) ?? [];
  const grandkids = kids.flatMap(k => index.children.get(k.id) ?? []);
  return { current, kids, grandkids };
}
```

### 2.3 Responsive layout logic

1. **Measure available space**
   Attach a `ResizeObserver` to the outer card container to obtain `width` and `height`.

2. **Calculate column count per generation**

```ts
const MIN_CARD_WIDTH = 220;          // tweak as design guide line
const cols = Math.max(1, Math.floor(width / MIN_CARD_WIDTH));
```

3. **Grid template**
   Use CSS Grid; one row per generation:

```css
display: grid;
grid-template-rows: auto 1fr 1fr;        /* root / children / grandchildren */
grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
gap: 0.75rem;
```

*The root card uses `grid-column: 1/-1` so it spans full width, then children and grandchildren auto-flow underneath.*

4. **Aspect fill**
   Give each inner card `height: 100%` and let the grid rows share the remaining height with `grid-auto-rows: 1fr`, ensuring the overall component expands to its parent (use a flex wrapper if the card itself must stretch).

### 2.4 React component outline

```tsx
function CapabilityCard({ nodes, currentId }) {
  const ref = useRef<HTMLDivElement>(null);
  const { width } = useResizeObserver(ref);
  const { current, kids, grandkids } = useMemo(
      () => getCardSubtree(buildIndex(nodes), currentId),
      [nodes, currentId]
  );
  const cols = Math.max(1, Math.floor(width / 220));

  return (
    <div ref={ref} className="h-full w-full p-4 overflow-auto">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        <CapabilityTile node={current} span />        {/* spans all cols */}
        {kids.map(n => <CapabilityTile key={n.id} node={n} />)}
        {grandkids.map(n => <CapabilityTile key={n.id} node={n} />)}
      </div>
    </div>
  );
}
```

*Key points*

* `useResizeObserver` (or [@juggle/resize-observer](https://github.com/juggle/resize-observer)) keeps the grid responsive without window-level listeners.
* A plain array is sufficient because we always cap depth to three generations.
* If the node set could be large, wrap children lists in `memo` + `React.lazy` or virtualize rows, but that is usually unnecessary for “one hop” views.

### 2.5 Styling of individual tiles (`CapabilityTile`)

* Header: capability name (verb-noun), coloured chip for maturity (1–5) if available.
* Body: description, max \~5 lines with `line-clamp` to avoid overflow.
* Footer: optional KPI badges (e.g. cost, SLA) coloured following heat-map rules (R/Y/G) widely used in capability dashboards([www.boc-group.com][7]).

Tailwind utility classes (`p-4 rounded-2xl shadow`) or Chakra UI boxes will meet the “fill available space but stay elegant” requirement; CSS grid’s inherent equal-height behaviour removes the need for JS-driven height calculations.

---

## 3  Extending the algorithm for richer cards

* **Maturity & importance sliders** – capture scores in the card and immediately colour-code tiles; calculations follow the 3-dimension model (strategic importance, maturity, adaptability) advocated by Bizzdesign([Bizzdesign][5]).
* **Links to value-stream stages, owners or applications** – add small pill components that route users to other canvases when clicked; because the card is already grid-based, you can drop these into an extra row without breaking the layout.
* **Heat-map mode** – inject style from an external theme object so enterprise architects can toggle viewpoints (e.g. investment hotspots) the same way BOC Group demonstrates on capability maps([www.boc-group.com][7]).

---

## 4  Putting it all together

1. **Capture canonical data** in the capability card template described in §1 so everyone works from the same “single source of truth”.
2. **Implement the algorithm in §2**; the only run-time input you need is the node list and the selected node id.
3. **Iterate** – once the card is in place, you can layer on maturity assessment, investment heat-maps, or drill-through links without changing the core algorithm.

With this approach your Vite-powered React application will render an adaptive, standards-conformant capability card that always fits its container and gives stakeholders a succinct, three-generation window into the capability landscape.