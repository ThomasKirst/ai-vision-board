import PromptForm from "./components/PromptForm";
import PromptTable from "./components/PromptTable";

export default async function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Prompt to Image</h1>
      <PromptForm />
      <PromptTable />
    </main>
  );
}
