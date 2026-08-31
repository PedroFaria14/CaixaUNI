import logoImage from '../assets/Logo.png';

type LogoMarkProps = {
  compact?: boolean;
};

function LogoMark({ compact = false }: LogoMarkProps) {
  return (
    <div className={compact ? 'logo-mark compact-logo' : 'logo-mark'} aria-hidden="true">
      <img src={logoImage} alt="" />
    </div>
  );
}

export default LogoMark;
