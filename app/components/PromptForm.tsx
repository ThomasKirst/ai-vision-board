"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { generateImage } from "@/app/actions/generateImage"; // Import the server action
import { Loader2 } from "lucide-react";

export default function PromptForm() {
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState("512x512");
  const [quality, setQuality] = useState(90);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await generateImage({ prompt, resolution, quality });
      console.log("Image generated:", result);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div>
        <Label htmlFor="prompt">Prompt</Label>
        <Input
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          required
        />
      </div>
      <div>
        <Label htmlFor="resolution">Resolution</Label>
        <select
          id="resolution"
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="256x256">256x256</option>
          <option value="512x512">512x512</option>
          <option value="1024x1024">1024x1024</option>
          <option value="1440x810">1440x810 (16:9)</option>
        </select>
      </div>
      <div>
        <Label htmlFor="quality">Quality ({quality})</Label>
        <Slider
          id="quality"
          min={0}
          max={100}
          step={1}
          value={[quality]}
          onValueChange={(value) => setQuality(value[0])}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Image"
        )}
      </Button>
    </form>
  );
}
