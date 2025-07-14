import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/assets/logo.png"
        alt="G"
        width={100}
        height={100}
        className="h-12 w-12"
      />
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F7B24D] to-[#34a85b]">
        Monkey Tours
      </h2>
    </Link>
  );
};

export default Logo;
