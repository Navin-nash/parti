import { readSource, languageOf } from "@/lib/source";
import { entry } from "@/lib/registry";
import { CodeBlock } from "@/components/code/code-block";
import { ComparisonViewer } from "./comparison-viewer";
import { WorkbenchTabs } from "./workbench-tabs";
import { ArmBadge } from "@/components/specimen/arm-badge";
import { DifferenceMatrix } from "./difference-matrix";
import { FindingsPanel } from "./findings-panel";
import { StateMatrix } from "./state-matrix";
import type { Finding, MatrixRow, StateSpec } from "@/lib/schema";

/**
 * The full comparison surface: four tabs over one pair of arms.
 *
 * Server component. It reads both arm files off disk, highlights them, and
 * hands finished markup to the client tab shell - so the Code tab is the real
 * implementation rather than a snippet stored beside it, and none of the
 * highlighting cost reaches the browser.
 */
export async function PairWorkbench({
  title,
  baselineKey,
  partiKey,
  prompt,
  promptNote,
  baselineRationale,
  partiRationale,
  matrix,
  findings,
  baselineStates,
  partiStates,
}: {
  title: string;
  baselineKey: string;
  partiKey: string;
  prompt: string;
  promptNote?: string;
  baselineRationale: string;
  partiRationale: string;
  matrix: MatrixRow[];
  findings: Finding[];
  baselineStates: StateSpec[];
  partiStates: StateSpec[];
}) {
  const b = entry(baselineKey);
  const p = entry(partiKey);
  const [bSrc, pSrc] = await Promise.all([
    readSource(b.sourcePath),
    readSource(p.sourcePath),
  ]);

  return (
    <WorkbenchTabs
      preview={
        <ComparisonViewer
          title={title}
          baseline={b.render()}
          parti={p.render()}
          bleed={b.bleed || p.bleed}
        />
      }
      code={
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <div className="mb-2">
              <ArmBadge arm="baseline" />
            </div>
            <CodeBlock
              code={bSrc}
              lang={languageOf(b.sourcePath)}
              path={b.sourcePath}
              lineNumbers
              maxHeight="46rem"
            />
          </div>
          <div>
            <div className="mb-2">
              <ArmBadge arm="parti" />
            </div>
            <CodeBlock
              code={pSrc}
              lang={languageOf(p.sourcePath)}
              path={p.sourcePath}
              lineNumbers
              maxHeight="46rem"
            />
          </div>
        </div>
      }
      prompt={
        <div className="space-y-6">
          <div>
            <h3 className="plate-label mb-3">The brief, given to both arms verbatim</h3>
            <CodeBlock code={prompt} lang="markdown" wrap maxHeight={null} />
          </div>
          {promptNote ? (
            <p className="max-w-[68ch] rounded-xl bg-plate-2 p-4 text-[0.875rem] leading-relaxed text-ink-muted">
              {promptNote}
            </p>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-plate-2 p-4">
              <div className="mb-3">
                <ArmBadge arm="baseline" />
              </div>
              <p className="text-[0.875rem] leading-relaxed text-ink-muted">
                {baselineRationale}
              </p>
            </div>
            <div className="rounded-xl bg-plate-2 p-4">
              <div className="mb-3">
                <ArmBadge arm="parti" />
              </div>
              <p className="text-[0.875rem] leading-relaxed text-ink-muted">
                {partiRationale}
              </p>
            </div>
          </div>
        </div>
      }
      design={
        <div className="space-y-8">
          <section>
            <h3 className="plate-label mb-3">Why this is different</h3>
            <FindingsPanel findings={findings} />
          </section>

          <section>
            <h3 className="plate-label mb-3">Difference matrix</h3>
            <DifferenceMatrix rows={matrix} />
          </section>

          <section>
            <h3 className="plate-label mb-3">State coverage</h3>
            <p className="mb-3 max-w-[68ch] text-[0.875rem] leading-relaxed text-ink-muted">
              The gap between these two tables is usually the largest real
              difference between the arms, and it is the one difference that is
              completely invisible in a screenshot.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl bg-plate-2">
                <div className="p-3">
                  <ArmBadge arm="baseline" />
                </div>
                <StateMatrix states={baselineStates} />
              </div>
              <div className="overflow-hidden rounded-xl bg-plate-2">
                <div className="p-3">
                  <ArmBadge arm="parti" />
                </div>
                <StateMatrix states={partiStates} />
              </div>
            </div>
          </section>
        </div>
      }
    />
  );
}
