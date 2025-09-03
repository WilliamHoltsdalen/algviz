'use client';

import { AlgorithmProvider } from '@/context/AlgorithmContext';
import AlgorithmSelector, { ALGORITHM_CATEGORIES } from '@/components/AlgorithmSelector';
import VisualizationWrapper from '@/components/VisualizationWrapper';
import ControlPanel from '@/components/ControlPanel';
import AlgorithmInfo from '@/components/AlgorithmInfo';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt, IconBug, IconHelp, IconInfoCircle } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { useAlgorithm } from '@/context/AlgorithmContext';

function SidebarMenu({
  sidebarOpen,
  setSidebarOpen,
  category,
  setCategory,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  category: string;
  setCategory: (c: string) => void;
}) {
  const { dispatch } = useAlgorithm();
  return (
    <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
      <SidebarBody className="justify-between gap-8">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <a href="/" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
            {sidebarOpen ? (
              <>
                <img 
                  src="/AlgViz_light.svg" 
                  alt="AlgViz" 
                  className="h-24 w-24 shrink-0 dark:hidden"
                />
                <img 
                  src="/AlgViz_dark.svg" 
                  alt="AlgViz" 
                  className="h-16 w-48 shrink-0 hidden dark:block"
                />
              </>
            ) : (
              <img 
                src="/icon.svg" 
                alt="AlgViz" 
                className="h-10 w-10 shrink-0"
              />
            )}
          </a>
          <div className="mt-8 flex flex-col gap-2">
            { sidebarOpen && (
              <>
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Categories</p>
                <hr className="my-2 border-neutral-200 dark:border-neutral-600" />
              </>
            )}
            {ALGORITHM_CATEGORIES.map((cat) => (
              <SidebarLink
                key={cat.id}
                link={{
                  label: cat.name,
                  href: '#',
                  icon: (
                    cat.id === 'sorting' ? (
                      <IconBrandTabler className={cn('h-5 w-5 shrink-0', !sidebarOpen && category === cat.id ? 'text-blue-500' : 'text-neutral-700 dark:text-neutral-200')} />
                    ) : cat.id === 'graph' ? (
                      <IconUserBolt className={cn('h-5 w-5 shrink-0', !sidebarOpen && category === cat.id ? 'text-blue-500' : 'text-neutral-700 dark:text-neutral-200')} />
                    ) : cat.id === 'pathfinding' ? (
                      <IconSettings className={cn('h-5 w-5 shrink-0', !sidebarOpen && category === cat.id ? 'text-blue-500' : 'text-neutral-700 dark:text-neutral-200')} />
                    ) : (
                      <IconBrandTabler className={cn('h-5 w-5 shrink-0', !sidebarOpen && category === cat.id ? 'text-blue-500' : 'text-neutral-700 dark:text-neutral-200')} />
                    )
                  ),
                }}
                className={cn(
                  'rounded-md border border-transparent',
                  sidebarOpen && category === cat.id && 'bg-neutral-200/50 dark:bg-blue-600/10 border-blue-600/40 px-2'
                )}
                onClick={(e) => { e.preventDefault(); setCategory(cat.id); }}
              />
            ))}
          </div>
          
          {/* Support Section */}
          <div className="mt-auto">
            {sidebarOpen && (
              <>
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Support</p>
                <hr className="my-2 border-neutral-200 dark:border-neutral-600" />
              </>
            )}
            <div className="space-y-2">
              <SidebarLink
                link={{ 
                  label: 'Report Bug', 
                  href: 'https://github.com/WilliamHoltsdalen/algviz/issues/new?assignees=&labels=bug&template=bug_report.yml&title=%5BBug%5D+&body=**Describe+the+bug**%0A_A+clear+and+concise+description+of+what+the+bug+is._%0A%0A**Steps+to+reproduce**%0A1.+Go+to+...%0A2.+Click+on+...%0A3.+Scroll+down+to+...%0A4.+See+error%0A%0A**Expected+behavior**%0A_What+did+you+expect+to+happen%3F_%0A%0A**Screenshots+or+recording**%0A_If+applicable%2C+add+a+screenshot+or+GIF+to+help+explain+your+problem._%0A%0A**Environment**%0A-+OS%3A+%0A-+Browser%3A+%0A-+App+version%3A+', 
                  icon: <IconBug className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> 
                }}
              />
              <SidebarLink
                link={{ 
                  label: 'Documentation', 
                  href: 'https://github.com/WilliamHoltsdalen/algviz/blob/main/README.md', 
                  icon: <IconInfoCircle className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> 
                }}
              />
            </div>
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

export default function AppPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [category, setCategory] = useState<string>('sorting');
  return (
    <AlgorithmProvider>
        <div className={cn('flex w-full flex-1 flex-col md:flex-row', 'min-h-screen')}>
          <SidebarMenu
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            category={category}
            setCategory={setCategory}
          />

          <main className="flex flex-1 flex-col gap-6 p-4 md:p-10">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <AlgorithmSelector selectedCategory={category} hideCategoryTabs />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <VisualizationWrapper />
                <ControlPanel />
                <AlgorithmInfo />
              </div>
            </div>
          </main>
        </div>
    </AlgorithmProvider>
  );
}
