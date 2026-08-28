type PageTitleProps = {
  eyebrow: string;
  title: string;
  description: string;
};

function PageTitle({ eyebrow, title, description }: PageTitleProps) {
  return (
    <div className="page-title">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default PageTitle;
