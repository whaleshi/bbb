import { title } from "@/components/primitives";
import Transaction from "@/components/transaction/Form";
import Slippage from "@/components/transaction/Slippage";
export default function DocsPage() {
  return (
    <div>
      <h1 className={title()}>Docs</h1>
      {/* <Transaction /> */}
      <Slippage />
    </div>
  );
}
