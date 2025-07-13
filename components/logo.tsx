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
        className="h-7 w-7"
      />
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F7B24D] to-[#ED266F]">
        Monkey Tours
      </h2>
    </Link>
  );
};

export default Logo;
