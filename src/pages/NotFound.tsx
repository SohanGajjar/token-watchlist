import { Link } from 'react-router-dom';
import { HiOutlineHome } from 'react-icons/hi2';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <Link to="/" className="btn-primary inline-flex">
          <HiOutlineHome className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
