import Link from 'next/link';
import { FC } from 'react';

const CustomLink: FC<{ path: string }> = ({ path, children }) => (
    <Link href={path}>
      <a>{children}</a>
    </Link>
  );

export default CustomLink;
