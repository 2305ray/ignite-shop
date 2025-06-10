import { useRouter } from "next/router";

export default function Shop() {
  const { query } = useRouter();

  return (
    <>
      <h1>Product</h1>
      <p>olaaa</p>
    </>
  );
}
