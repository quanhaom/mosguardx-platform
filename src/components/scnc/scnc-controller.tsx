"use client";

import Image from "next/image";
import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { useLanguage } from "@/components/i18n/language-context";

import {
  DEFAULT_SCNC_SETTINGS,
  SCNC_COPY,
  SCNC_STORAGE,
  getSCNCStepsForRoute,
  type SCNCCorner,
  type SCNCSettings,
  type SCNCTourStep,
} from "@/lib/scnc/config";

type Position = {
  x: number;
  y: number;
};

const DESKTOP_MASCOT_SIZE = 108;
const MOBILE_MASCOT_SIZE = 72;

const MOVE_DURATION = 680;

const DESKTOP_TOP_SAFE = 92;
const MOBILE_TOP_SAFE = 78;

const DESKTOP_PADDING = 22;
const MOBILE_PADDING = 10;

/* =========================================================
   SCREEN
========================================================= */

function isMobile() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.innerWidth < 768;
}

function getMascotSize() {
  return isMobile()
    ? MOBILE_MASCOT_SIZE
    : DESKTOP_MASCOT_SIZE;
}

function getSafeTop() {
  return isMobile()
    ? MOBILE_TOP_SAFE
    : DESKTOP_TOP_SAFE;
}

function getPadding() {
  return isMobile()
    ? MOBILE_PADDING
    : DESKTOP_PADDING;
}

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    Math.max(
      value,
      min,
    ),
    max,
  );
}

/* =========================================================
   CORNERS
========================================================= */

function getCornerPosition(
  corner: SCNCCorner,
): Position {
  const size =
    getMascotSize();

  const half =
    size / 2;

  const edge =
    getPadding();

  const left =
    edge + half;

  const right =
    window.innerWidth -
    edge -
    half;

  const top =
    getSafeTop() +
    half;

  const bottom =
    window.innerHeight -
    edge -
    half;

  switch (corner) {
    case "top-left":
      return {
        x: left,
        y: top,
      };

    case "top-right":
      return {
        x: right,
        y: top,
      };

    case "bottom-left":
      return {
        x: left,
        y: bottom,
      };

    case "bottom-right":
    default:
      return {
        x: right,
        y: bottom,
      };
  }
}

function isRightCorner(
  corner?: SCNCCorner,
) {
  return (
    corner ===
      "top-right" ||
    corner ===
      "bottom-right"
  );
}

function isBottomCorner(
  corner?: SCNCCorner,
) {
  return (
    corner ===
      "bottom-left" ||
    corner ===
      "bottom-right"
  );
}

/* =========================================================
   DIALOG POSITION
========================================================= */

function getDialogPosition(
  mascot: Position,
  corner?: SCNCCorner,
): CSSProperties {
  const size =
    getMascotSize();

  const edge =
    getPadding();

  const gap =
    isMobile()
      ? 7
      : 12;

  /* =========================
     MOBILE
  ========================= */

  if (isMobile()) {
    const availableWidth =
      window.innerWidth -
      size -
      edge * 3 -
      gap;

    const width =
      Math.max(
        188,
        Math.min(
          238,
          availableWidth,
        ),
      );

    let left: number;

    if (
      isRightCorner(
        corner,
      )
    ) {
      left =
        mascot.x -
        size / 2 -
        gap -
        width;
    } else {
      left =
        mascot.x +
        size / 2 +
        gap;
    }

    left = clamp(
      left,
      edge,
      window.innerWidth -
        width -
        edge,
    );

    if (
      isBottomCorner(
        corner,
      )
    ) {
      return {
        left,
        bottom: edge,
        width,
        maxHeight: `calc(100dvh - ${
          getSafeTop() +
          edge
        }px)`,
      };
    }

    return {
      left,
      top: getSafeTop(),
      width,
      maxHeight: `calc(100dvh - ${
        getSafeTop() +
        edge
      }px)`,
    };
  }

  /* =========================
     DESKTOP
  ========================= */

  const width =
    320;

  const estimatedHeight =
    205;

  let left =
    mascot.x +
    size / 2 +
    gap;

  let top =
    mascot.y -
    28;

  if (
    left +
      width >
    window.innerWidth -
      edge
  ) {
    left =
      mascot.x -
      size / 2 -
      gap -
      width;
  }

  left = clamp(
    left,
    edge,
    window.innerWidth -
      width -
      edge,
  );

  top = clamp(
    top,
    getSafeTop(),
    window.innerHeight -
      estimatedHeight -
      edge,
  );

  return {
    left,
    top,
    width,
  };
}

/* =========================================================
   DOM HELPERS
========================================================= */

function getElements(
  selector?: string,
) {
  if (!selector) {
    return [];
  }

  return Array.from(
    document.querySelectorAll(
      selector,
    ),
  ) as HTMLElement[];
}

function isElementVisible(
  element: HTMLElement,
) {
  const rect =
    element.getBoundingClientRect();

  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > 0 &&
    rect.top <
      window.innerHeight
  );
}

function getVisibleTarget(
  selector?: string,
) {
  const elements =
    getElements(
      selector,
    );

  if (
    elements.length ===
    0
  ) {
    return null;
  }

  return (
    elements.find(
      isElementVisible,
    ) ??
    elements[0]
  );
}

/* =========================================================
   HIGHLIGHT
========================================================= */

function clearHighlight() {
  const highlighted =
    document.querySelectorAll(
      '[data-scnc-highlighted="true"]',
    );

  highlighted.forEach(
    (
      node,
    ) => {
      const element =
        node as HTMLElement;

      element.removeAttribute(
        "data-scnc-highlighted",
      );

      element.style.removeProperty(
        "position",
      );

      element.style.removeProperty(
        "z-index",
      );

      element.style.removeProperty(
        "outline",
      );

      element.style.removeProperty(
        "outline-offset",
      );

      element.style.removeProperty(
        "box-shadow",
      );

      element.style.removeProperty(
        "transition",
      );
    },
  );
}

function highlightTarget(
  element: HTMLElement,
) {
  clearHighlight();

  element.setAttribute(
    "data-scnc-highlighted",
    "true",
  );

  const computed =
    window.getComputedStyle(
      element,
    );

  if (
    computed.position ===
    "static"
  ) {
    element.style.position =
      "relative";
  }

  element.style.zIndex =
    "30";

  element.style.outline =
    "2px solid rgba(52,211,153,.78)";

  element.style.outlineOffset =
    "5px";

  element.style.boxShadow =
    "0 0 0 5px rgba(52,211,153,.08)";

  element.style.transition =
    "outline 220ms ease, box-shadow 220ms ease";
}

/* =========================================================
   SETTINGS
========================================================= */

function readSettings():
  SCNCSettings {
  const raw =
    localStorage.getItem(
      SCNC_STORAGE.settings,
    );

  if (!raw) {
    return DEFAULT_SCNC_SETTINGS;
  }

  try {
    return {
      ...DEFAULT_SCNC_SETTINGS,
      ...JSON.parse(
        raw,
      ),
    };
  } catch {
    return DEFAULT_SCNC_SETTINGS;
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export default function SCNCController() {
  const pathname =
    usePathname();

  const {
    t,
  } = useLanguage();

  const [
    mounted,
    setMounted,
  ] = useState(false);

  const [
    settings,
    setSettings,
  ] = useState<SCNCSettings>(
    DEFAULT_SCNC_SETTINGS,
  );

  const [
    tourActive,
    setTourActive,
  ] = useState(false);

  const [
    stepIndex,
    setStepIndex,
  ] = useState(0);

  const [
    position,
    setPosition,
  ] = useState<Position>({
    x: 0,
    y: 0,
  });

  const [
    moving,
    setMoving,
  ] = useState(false);

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const moveTimer =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const autoNavigateTimer =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const scrollFrame =
    useRef<
      number | null
    >(null);

  const autoNavigating =
    useRef(false);

  const routeSteps =
    useMemo(
      () =>
        getSCNCStepsForRoute(
          pathname,
        ),
      [
        pathname,
      ],
    );

  const currentStep =
    routeSteps[
      stepIndex
    ];

  const saveSettings =
    useCallback(
      (
        next:
          SCNCSettings,
      ) => {
        setSettings(
          next,
        );

        localStorage.setItem(
          SCNC_STORAGE.settings,
          JSON.stringify(
            next,
          ),
        );
      },
      [],
    );

  /* =======================================================
     FIND CURRENT STEP
  ======================================================= */

  const findCurrentStepIndex =
    useCallback(() => {
      if (
        routeSteps.length ===
        0
      ) {
        return null;
      }

      const probe =
        window.innerHeight *
        0.45;

      let bestIndex:
        number | null =
        null;

      let bestDistance =
        Number.POSITIVE_INFINITY;

      routeSteps.forEach(
        (
          step,
          index,
        ) => {
          if (
            step.trigger ===
            "page"
          ) {
            if (
              window.scrollY <
              150
            ) {
              if (
                index <
                bestDistance
              ) {
                bestIndex =
                  index;

                bestDistance =
                  index;
              }
            }

            return;
          }

          if (
            !step.target
          ) {
            return;
          }

          const elements =
            getElements(
              step.target,
            );

          for (
            const element
            of elements
          ) {
            const rect =
              element.getBoundingClientRect();

            if (
              rect.bottom <=
                0 ||
              rect.top >=
                window.innerHeight
            ) {
              continue;
            }

            if (
              rect.top <=
                probe &&
              rect.bottom >=
                probe
            ) {
              const score =
                step.trigger ===
                  "visible"
                  ? 4
                  : 0;

              if (
                score <
                bestDistance
              ) {
                bestIndex =
                  index;

                bestDistance =
                  score;
              }

              continue;
            }

            const center =
              rect.top +
              rect.height /
                2;

            let distance =
              Math.abs(
                center -
                  probe,
              );

            if (
              step.trigger ===
              "visible"
            ) {
              distance *=
                0.45;
            }

            if (
              distance <
              bestDistance
            ) {
              bestIndex =
                index;

              bestDistance =
                distance;
            }
          }
        },
      );

      return bestIndex;
    }, [
      routeSteps,
    ]);

  /* =======================================================
     MOVE
  ======================================================= */

  const moveToStep =
    useCallback(
      (
        step:
          SCNCTourStep,
      ) => {
        setMoving(
          true,
        );

        setPosition(
          getCornerPosition(
            step.corner,
          ),
        );

        clearHighlight();

        if (
          step.highlight &&
          step.target
        ) {
          const target =
            getVisibleTarget(
              step.target,
            );

          if (
            target &&
            isElementVisible(
              target,
            )
          ) {
            highlightTarget(
              target,
            );
          }
        }

        if (
          moveTimer.current
        ) {
          clearTimeout(
            moveTimer.current,
          );
        }

        moveTimer.current =
          setTimeout(
            () => {
              setMoving(
                false,
              );
            },
            MOVE_DURATION,
          );
      },
      [],
    );

  /* =======================================================
     SCROLL TO STEP
  ======================================================= */

  const scrollToStep =
    useCallback(
      (
        step:
          SCNCTourStep,
      ) => {
        if (
          !step.target
        ) {
          return;
        }

        const elements =
          getElements(
            step.target,
          );

        const target =
          elements[0];

        if (!target) {
          return;
        }

        target.scrollIntoView({
          behavior:
            "smooth",

          block:
            step.trigger ===
            "visible"
              ? "center"
              : "start",

          inline:
            "nearest",
        });
      },
      [],
    );

  /* =======================================================
     INIT / ROUTE
  ======================================================= */

  useEffect(() => {
    const loaded =
      readSettings();

    setSettings(
      loaded,
    );

    setMounted(
      true,
    );

    setMenuOpen(
      false,
    );

    clearHighlight();

    const timer =
      window.setTimeout(
        () => {
          if (
            routeSteps.length ===
            0
          ) {
            setTourActive(
              false,
            );

            setPosition(
              getCornerPosition(
                "bottom-right",
              ),
            );

            return;
          }

          const detected =
            findCurrentStepIndex();

          const stored =
            Number(
              localStorage.getItem(
                SCNC_STORAGE.step,
              ),
            );

          let initialIndex =
            detected ??
            0;

          if (
            Number.isInteger(
              stored,
            ) &&
            stored >=
              0 &&
            stored <
              routeSteps.length
          ) {
            initialIndex =
              detected ??
              stored;
          }

          setStepIndex(
            initialIndex,
          );

          if (
            loaded.guidance ===
            "full"
          ) {
            setTourActive(
              true,
            );

            moveToStep(
              routeSteps[
                initialIndex
              ],
            );
          } else {
            setTourActive(
              false,
            );

            setPosition(
              getCornerPosition(
                "bottom-right",
              ),
            );
          }
        },
        100,
      );

    localStorage.setItem(
      SCNC_STORAGE.route,
      pathname,
    );

    return () => {
      window.clearTimeout(
        timer,
      );

      clearHighlight();

      if (
        moveTimer.current
      ) {
        clearTimeout(
          moveTimer.current,
        );
      }

      if (
        autoNavigateTimer.current
      ) {
        clearTimeout(
          autoNavigateTimer.current,
        );
      }

      autoNavigating.current =
        false;
    };
  }, [
    findCurrentStepIndex,
    moveToStep,
    pathname,
    routeSteps,
  ]);

  /* =======================================================
     NATURAL SCROLL TRACKING
  ======================================================= */

  useEffect(() => {
    if (
      !mounted ||
      !tourActive ||
      routeSteps.length ===
        0
    ) {
      return;
    }

    function detect() {
      if (
        autoNavigating.current
      ) {
        return;
      }

      const detected =
        findCurrentStepIndex();

      if (
        detected ===
        null
      ) {
        return;
      }

      setStepIndex(
        (
          previous,
        ) =>
          previous ===
          detected
            ? previous
            : detected,
      );
    }

    function requestDetect() {
      if (
        scrollFrame.current !==
        null
      ) {
        cancelAnimationFrame(
          scrollFrame.current,
        );
      }

      scrollFrame.current =
        requestAnimationFrame(
          detect,
        );
    }

    requestDetect();

    window.addEventListener(
      "scroll",
      requestDetect,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      requestDetect,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        requestDetect,
      );

      window.removeEventListener(
        "resize",
        requestDetect,
      );

      if (
        scrollFrame.current !==
        null
      ) {
        cancelAnimationFrame(
          scrollFrame.current,
        );
      }
    };
  }, [
    findCurrentStepIndex,
    mounted,
    routeSteps,
    tourActive,
  ]);

  /* =======================================================
     STEP CHANGED
  ======================================================= */

  useEffect(() => {
    if (
      !mounted ||
      !tourActive ||
      !currentStep
    ) {
      return;
    }

    moveToStep(
      currentStep,
    );

    localStorage.setItem(
      SCNC_STORAGE.step,
      String(
        stepIndex,
      ),
    );
  }, [
    currentStep,
    mounted,
    moveToStep,
    stepIndex,
    tourActive,
  ]);

  /* =======================================================
     RESIZE
  ======================================================= */

  useEffect(() => {
    if (!mounted) {
      return;
    }

    function handleResize() {
      if (
        tourActive &&
        currentStep
      ) {
        setPosition(
          getCornerPosition(
            currentStep.corner,
          ),
        );
      } else {
        setPosition(
          getCornerPosition(
            "bottom-right",
          ),
        );
      }
    }

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, [
    currentStep,
    mounted,
    tourActive,
  ]);

  /* =======================================================
     STOP
  ======================================================= */

  function stopGuidance() {
    clearHighlight();

    autoNavigating.current =
      false;

    if (
      autoNavigateTimer.current
    ) {
      clearTimeout(
        autoNavigateTimer.current,
      );
    }

    setTourActive(
      false,
    );

    setMenuOpen(
      false,
    );

    saveSettings({
      ...settings,
      guidance:
        "manual",
    });

    setPosition(
      getCornerPosition(
        "bottom-right",
      ),
    );
  }

  /* =======================================================
     CONTINUE CURRENT VIEW
  ======================================================= */

  function continueGuide() {
    clearHighlight();

    saveSettings({
      ...settings,
      guidance:
        "full",
    });

    setMenuOpen(
      false,
    );

    const detected =
      findCurrentStepIndex();

    const resumeIndex =
      detected ??
      Math.min(
        stepIndex,
        Math.max(
          routeSteps.length -
            1,
          0,
        ),
      );

    setStepIndex(
      resumeIndex,
    );

    setTourActive(
      true,
    );

    const step =
      routeSteps[
        resumeIndex
      ];

    if (step) {
      moveToStep(
        step,
      );
    }
  }

  /* =======================================================
     NEXT
  ======================================================= */

  function goToNextStep() {
    if (
      routeSteps.length ===
      0
    ) {
      return;
    }

    const lastIndex =
      routeSteps.length -
      1;

    if (
      stepIndex >=
      lastIndex
    ) {
      stopGuidance();

      return;
    }

    const nextIndex =
      stepIndex +
      1;

    const nextStep =
      routeSteps[
        nextIndex
      ];

    if (!nextStep) {
      return;
    }

    autoNavigating.current =
      true;

    if (
      autoNavigateTimer.current
    ) {
      clearTimeout(
        autoNavigateTimer.current,
      );
    }

    setStepIndex(
      nextIndex,
    );

    moveToStep(
      nextStep,
    );

    localStorage.setItem(
      SCNC_STORAGE.step,
      String(
        nextIndex,
      ),
    );

    window.setTimeout(
      () => {
        scrollToStep(
          nextStep,
        );
      },
      70,
    );

    autoNavigateTimer.current =
      setTimeout(
        () => {
          autoNavigating.current =
            false;

          if (
            nextStep.highlight &&
            nextStep.target
          ) {
            const target =
              getVisibleTarget(
                nextStep.target,
              );

            if (
              target &&
              isElementVisible(
                target,
              )
            ) {
              highlightTarget(
                target,
              );
            }
          }
        },
        1100,
      );
  }

  /* =======================================================
     HIDE / SHOW
  ======================================================= */

  function hideSCNC() {
    clearHighlight();

    setTourActive(
      false,
    );

    setMenuOpen(
      false,
    );

    saveSettings({
      ...settings,
      guidance:
        "off",
    });
  }

  function showSCNC() {
    saveSettings({
      ...settings,
      guidance:
        "manual",
    });

    setTourActive(
      false,
    );

    setMenuOpen(
      false,
    );

    setPosition(
      getCornerPosition(
        "bottom-right",
      ),
    );
  }

  /* =======================================================
     CLIENT ONLY
  ======================================================= */

  if (!mounted) {
    return null;
  }

  /* =======================================================
     OFF MODE
  ======================================================= */

  if (
    settings.guidance ===
    "off"
  ) {
    return (
      <>
        {pathname !== "/" && (
          <Link
            href="/"
            className="fixed left-3 top-[82px] z-[210] inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold text-[#16352a] shadow-lg backdrop-blur-md transition hover:border-emerald-300 hover:text-emerald-700 md:left-5"
          >
            <ArrowLeft
              size={14}
            />

            {t(
              SCNC_COPY
                .backWebsite,
            )}
          </Link>
        )}

        <button
          type="button"
          onClick={
            showSCNC
          }
          className="fixed bottom-3 right-3 z-[190] flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/55 px-3 py-2 text-xs font-semibold text-white/80 shadow-lg backdrop-blur-md"
        >
          <Image
            src="/scnc.png"
            alt=""
            width={22}
            height={22}
            unoptimized
          />

          SCNC
        </button>
      </>
    );
  }

  const size =
    getMascotSize();

  const dialog =
    getDialogPosition(
      position,
      currentStep?.corner,
    );

  const mirrored =
    isRightCorner(
      currentStep?.corner,
    );

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      {/* BACK WEBSITE */}

      {pathname !== "/" && (
        <Link
          href="/"
          className="fixed left-3 top-[82px] z-[210] inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold text-[#16352a] shadow-lg backdrop-blur-md transition hover:border-emerald-300 hover:text-emerald-700 md:left-5"
        >
          <ArrowLeft
            size={14}
          />

          {t(
            SCNC_COPY
              .backWebsite,
          )}
        </Link>
      )}

      {/* MASCOT */}

      <div
        className="pointer-events-none fixed left-0 top-0 z-[180]"
        style={{
          transform:
            `translate3d(${
              position.x -
              size / 2
            }px, ${
              position.y -
              size / 2
            }px, 0)`,

          transition:
            `transform ${MOVE_DURATION}ms cubic-bezier(.22,1,.36,1)`,
        }}
      >
        <div
          className={
            moving
              ? "scnc-flying"
              : "scnc-idle"
          }
        >
          <button
            type="button"
            aria-label="SCNC"
            onClick={() => {
              if (
                tourActive
              ) {
                return;
              }

              setMenuOpen(
                (
                  previous,
                ) =>
                  !previous,
              );
            }}
            className="pointer-events-auto border-0 bg-transparent p-0"
          >
            <div
              style={{
                transform:
                  mirrored
                    ? "scaleX(-1)"
                    : "scaleX(1)",

                transition:
                  "transform 420ms cubic-bezier(.22,1,.36,1)",
              }}
            >
              <Image
                src="/scnc.png"
                alt="SCNC"
                width={
                  DESKTOP_MASCOT_SIZE
                }
                height={
                  DESKTOP_MASCOT_SIZE
                }
                priority
                unoptimized
                className="h-[72px] w-[72px] object-contain drop-shadow-[0_7px_12px_rgba(0,0,0,.18)] md:h-[108px] md:w-[108px]"
              />
            </div>
          </button>
        </div>
      </div>

      {/* DIALOG */}

      {tourActive &&
        currentStep && (
          <div
            className="fixed z-[190] flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 text-white shadow-[0_12px_30px_rgba(0,0,0,.2)] backdrop-blur-md md:p-3.5"
            style={{
              ...dialog,

              transition:
                `left ${MOVE_DURATION}ms cubic-bezier(.22,1,.36,1), top ${MOVE_DURATION}ms cubic-bezier(.22,1,.36,1), bottom ${MOVE_DURATION}ms cubic-bezier(.22,1,.36,1)`,
            }}
          >
            {/* HEADER */}

            <div className="flex shrink-0 items-center gap-2 px-3 pt-3 md:px-0 md:pt-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

              <span className="text-[10px] font-bold tracking-[0.14em] text-emerald-300 md:text-[11px]">
                SCNC
              </span>

              <span className="ml-auto text-[9px] text-white/35 md:text-[10px]">
                {stepIndex + 1}
                /
                {
                  routeSteps.length
                }
              </span>
            </div>

            {/* MESSAGE */}

            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-2 pt-2 md:overflow-visible md:px-0">
              <p className="text-[11px] leading-[1.55] text-white/90 md:text-sm md:leading-6">
                {t(
                  currentStep.message,
                )}
              </p>
            </div>

            {/* ACTIONS */}

            <div className="shrink-0 border-t border-white/10 bg-slate-950/20 p-2.5 md:mt-3 md:border-0 md:bg-transparent md:p-0">
              {/* MOBILE NEXT */}

              <button
                type="button"
                onClick={
                  goToNextStep
                }
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-400 px-3 py-2 text-[11px] font-bold text-[#10251f] shadow-sm transition hover:bg-emerald-300 active:scale-[0.98] md:hidden"
              >
                {stepIndex ===
                routeSteps.length -
                  1
                  ? t(
                      SCNC_COPY
                        .finishGuide,
                    )
                  : t(
                      SCNC_COPY
                        .nextGuide,
                    )}

                {stepIndex <
                  routeSteps.length -
                    1 && (
                  <ArrowRight
                    size={13}
                  />
                )}
              </button>

              {/* MOBILE STOP */}

              <button
                type="button"
                onClick={
                  stopGuidance
                }
                className="mt-2 w-full text-center text-[9px] text-white/40 transition hover:text-white/70 md:hidden"
              >
                {t(
                  SCNC_COPY
                    .stopGuide,
                )}
              </button>

              {/* DESKTOP ACTIONS */}

              <div className="hidden items-center justify-between gap-3 md:flex">
                <button
                  type="button"
                  onClick={
                    stopGuidance
                  }
                  className="text-left text-[11px] leading-4 text-white/40 transition hover:text-white/75"
                >
                  {t(
                    SCNC_COPY
                      .stopGuide,
                  )}
                </button>

                <button
                  type="button"
                  onClick={
                    goToNextStep
                  }
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-bold text-[#10251f] shadow-lg shadow-emerald-950/10 transition hover:bg-emerald-300 active:scale-[0.97]"
                >
                  {stepIndex ===
                  routeSteps.length -
                    1
                    ? t(
                        SCNC_COPY
                          .finishGuide,
                      )
                    : t(
                        SCNC_COPY
                          .nextGuide,
                      )}

                  {stepIndex <
                    routeSteps.length -
                      1 && (
                    <ArrowRight
                      size={14}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      {/* MANUAL MENU */}

      {!tourActive &&
        menuOpen && (
          <div className="fixed bottom-[100px] right-3 z-[190] w-[220px] rounded-2xl border border-white/10 bg-slate-950/65 p-2 text-white shadow-xl backdrop-blur-md md:bottom-[126px] md:right-5 md:w-[230px]">
            <div className="px-3 py-2">
              <p className="text-sm font-bold">
                SCNC
              </p>

              <p className="mt-1 text-xs text-white/45">
                {t(
                  SCNC_COPY
                    .assistantTitle,
                )}
              </p>
            </div>

            {routeSteps.length >
              0 && (
              <button
                type="button"
                onClick={
                  continueGuide
                }
                className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                {t(
                  SCNC_COPY
                    .continueGuide,
                )}
              </button>
            )}

            <button
              type="button"
              onClick={
                hideSCNC
              }
              className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-white/45 transition hover:bg-white/5 hover:text-white/70"
            >
              {t(
                SCNC_COPY
                  .hideSCNC,
              )}
            </button>
          </div>
        )}

      {/* ANIMATION */}

      <style jsx global>{`
        @keyframes scnc-idle {
          0%,
          100% {
            transform:
              translateY(0)
              rotate(-1deg);
          }

          50% {
            transform:
              translateY(-4px)
              rotate(1deg);
          }
        }

        @keyframes scnc-flying {
          0% {
            transform:
              translateY(0)
              rotate(-4deg)
              scale(1);
          }

          45% {
            transform:
              translateY(-7px)
              rotate(3deg)
              scale(1.025);
          }

          100% {
            transform:
              translateY(0)
              rotate(0)
              scale(1);
          }
        }

        .scnc-idle {
          animation:
            scnc-idle
            3.4s
            ease-in-out
            infinite;
        }

        .scnc-flying {
          animation:
            scnc-flying
            .68s
            ease-in-out
            infinite;
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .scnc-idle,
          .scnc-flying {
            animation:
              none;
          }
        }
      `}</style>
    </>
  );
}