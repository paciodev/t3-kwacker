import Link from "next/link";

const Footer = () => {
  return (
    <div className="mt-12	border-t-4 py-12 text-center">
      <div>
        Created by{" "}
        <Link
          href="https://pacio.dev"
          className="text-blue-500 hover:underline"
          target="_blank"
        >
          Pacio
        </Link>
      </div>
      <div>
        With{" "}
        <Link
          href="https://create.t3.gg"
          className="text-blue-500 hover:underline"
          target="_blank"
        >
          T3 Stack
        </Link>
      </div>
    </div>
  );
};

export default Footer;
