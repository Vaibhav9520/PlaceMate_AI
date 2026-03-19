import TopNavbar from './TopNavbar';
import BackButton from './BackButton';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopNavbar />
      <div className="w-full relative">
        <BackButton />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;