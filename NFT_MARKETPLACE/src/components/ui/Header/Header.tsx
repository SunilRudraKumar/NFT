import { ConnectKitButton } from 'connectkit';

import { Link } from 'react-router-dom';


const Header = () => {
    return (
        <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
                    <nav className="flex-1">
                <ul className="flex gap-4">
                    <li>
                        <Link to="/mint" className="text-white no-underline hover:underline">Mint</Link>
                    </li>
                    <li>
                        <Link to="/view" className="text-white no-underline hover:underline">View</Link>
                    </li>
                </ul>
            </nav>
            <ConnectKitButton />
        </header>
    );
};

export default Header;
