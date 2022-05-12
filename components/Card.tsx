export function Card({ children }: { children: JSX.Element | JSX.Element[] }) {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        minWidth: "350px",
        maxWidth: "400px",
        minHeight: "280px",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "20rem",
        padding: "1rem",
        margin: "1rem",
        overflow: "auto",
        border: "1px solid",
        borderRadius: "1rem",
      }}
    >
      {children}
    </div>
  );
}
