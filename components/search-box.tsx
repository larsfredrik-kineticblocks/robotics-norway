import { Mascot } from "@/components/mascot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SearchBoxProps = {
  defaultQuery?: string;
  welcome?: boolean;
  id?: string;
};

export function SearchBox({ defaultQuery = "", welcome = false, id = "q" }: SearchBoxProps) {
  return (
    <div className="grid items-end gap-6 md:grid-cols-[auto_1fr] md:gap-10">
      <div className="flex items-end gap-3">
        <Mascot className="h-36 w-auto drop-shadow-[0_10px_18px_rgb(0_32_91/0.08)] sm:h-44" />
        {welcome ? (
          <p className="relative mb-8 max-w-[14rem] rounded-2xl border border-border bg-white px-4 py-3 font-heading text-lg leading-snug text-navy shadow-sm">
            <span
              className="absolute top-8 -left-1.5 size-3 rotate-45 border-b border-l border-border bg-white"
              aria-hidden
            />
            Welcome to Robotics Norway
          </p>
        ) : null}
      </div>
      <form action="/search" method="get" className="pb-2" role="search">
        <Label htmlFor={id} className="font-heading text-sm tracking-wide text-navy">
          Search the network
        </Label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Input
            id={id}
            name="q"
            key={defaultQuery}
            defaultValue={defaultQuery}
            placeholder="Charter, news, documents, members"
            className="h-12 px-4 text-base md:text-base"
          />
          <Button type="submit" className="h-12 px-6">
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}
