import Dompurify from "dompurify";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
}

function PurifyRenderer({ content, className }: Props) {
  const purifiedContent = Dompurify.sanitize(content);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: purifiedContent }}
      className={className}
    />
  );
}

export default PurifyRenderer;
