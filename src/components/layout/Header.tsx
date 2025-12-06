import { HiOutlineSquare3Stack3D } from 'react-icons/hi2';
import WalletConnectButton from '../wallet/WalletConnectButton';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background border-b border-card-border">
      <div className="container flex h-14 md:h-16 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-primary rounded-lg flex items-center justify-center">
            <HiOutlineSquare3Stack3D className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
          </div>
          <span className="text-base md:text-lg font-semibold text-foreground">
            Token Portfolio
          </span>
        </div>
        
        <WalletConnectButton />
      </div>
    </header>
  );
}
