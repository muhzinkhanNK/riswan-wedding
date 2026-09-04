import { weddingData } from '../data/wedding';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-divider">✦</div>
      <p className="footer-sub">WITH WARM REGARDS &amp; BLESSINGS</p>
      <h2 className="footer-couple">
        {weddingData.groom.fullName} &amp; {weddingData.bride.fullName}
      </h2>
      <p className="footer-date">27.12.2026 &bull; KOLLAM, KERALA</p>
    </footer>
  );
}

