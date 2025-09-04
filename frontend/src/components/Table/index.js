import React, {
  useMemo,
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { TableContainer, Table, Th, Td } from "@styles/Table/Table.styled";

function StyledTable(props) {
  const { columns = [], data = [] } = props;

  // stable data with index
  const dataWithIndex = useMemo(
    () => (data || []).map((item, idx) => ({ ...item, index: idx + 1 })),
    [data]
  );

  const wrapRef = useRef(null);
  const headerRef = useRef(null);
  const didInitRef = useRef(false);
  const scrollTimerRef = useRef();

  // after first paint measure header natural sizes (based on title)
  const [colWidths, setColWidths] = useState(null);

  useLayoutEffect(() => {
    if (didInitRef.current) return;
    const headerEl = headerRef.current;
    if (!headerEl) return;

    // measure header row height and cells widths
    const headerRect = headerEl.getBoundingClientRect();
    const ths = headerEl.querySelectorAll("th");
    if (!ths || ths.length === 0) return;

    const widths = Array.from(ths).map((th) =>
      Math.max(1, Math.ceil(th.getBoundingClientRect().width))
    );

    // set CSS var for header height so Th uses it (prevents later stretching)
    if (wrapRef.current) {
      wrapRef.current.style.setProperty(
        "--header-height",
        `${Math.ceil(headerRect.height)}px`
      );
    }

    // freeze widths (px) so future body content won’t change layout
    setColWidths(widths.map((w) => `${w}px`));

    didInitRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  const onScroll = () => {
    const el = wrapRef.current;
    if (!el) return;
    el.classList.add("isScrolling");
    clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      el.classList.remove("isScrolling");
    }, 600);
  };

  useEffect(() => () => clearTimeout(scrollTimerRef.current), []);

  return (
    <TableContainer ref={wrapRef} onScroll={onScroll}>
      {/* use fixed layout only after we captured column widths */}
      <Table $fixed={!!colWidths}>
        <thead ref={headerRef}>
          <tr>
            {(columns || []).map((col, idx) => {
              const headerSticky = col.sticky
                ? col.sticky === "col"
                  ? "both"
                  : col.sticky
                : "row";
              const w = colWidths ? colWidths[idx] : col.width;
              return (
                <Th
                  key={col.key || idx}
                  style={{ width: w }}
                  $sticky={headerSticky}
                >
                  {col.title}
                </Th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {(dataWithIndex || []).map((row, rIdx) => (
            <tr key={rIdx}>
              {columns.map((col, cIdx) => {
                const fieldName = col.dataIndex ?? col.key;
                const value =
                  typeof col.render === "function"
                    ? col.render(row, rIdx)
                    : fieldName && row
                    ? row[fieldName]
                    : undefined;
                const cellSticky = col.sticky === "col" ? "col" : undefined;
                const w = colWidths ? colWidths[cIdx] : col.width;
                return (
                  <Td
                    key={`${rIdx}-${cIdx}`}
                    style={{ width: w, textAlign: col.align || "left" }}
                    $sticky={cellSticky}
                  >
                    {value}
                  </Td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}

export default React.memo(StyledTable);
