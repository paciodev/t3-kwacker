import Link from "next/link";

const Footer = () => {
  return (
    <div className="mt-12	border-t-4 py-12 text-center">
      <div className="flex justify-center space-x-1">
        <div>Created by </div>
        <Link
          href="https://pacio.dev"
          className="text-blue-500 hover:underline"
          target="_blank"
        >
          <div>Pacio</div>
        </Link>
      </div>
      <div className="flex justify-center space-x-1">
        <div>With </div>
        <Link
          href="https://create.t3.gg"
          className="text-blue-500 hover:underline"
          target="_blank"
        >
          <div>T3 Stack</div>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
