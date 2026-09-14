"use client";

import Image from "next/image";
import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
} from "lucide-react";

import {
  useLanguage,
} from "@/components/i18n/language-context";

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


const DESKTOP_MASCOT_SIZE =
  108;

const MOBILE_MASCOT_SIZE =
  82;

const MOVE_DURATION =
  680;

const DESKTOP_TOP_SAFE =
  92;

const MOBILE_TOP_SAFE =
  86;

const DESKTOP_PADDING =
  22;

const MOBILE_PADDING =
  12;


/* =========================================================
   SCREEN
========================================================= */

function isMobile() {
  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  return (
    window.innerWidth <
    768
  );
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
   FOUR CORNERS
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
    edge +
    half;

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


/* =========================================================
   DIALOG
========================================================= */

function getDialogPosition(
  mascot:
    Position,
): CSSProperties {
  const size =
    getMascotSize();

  const edge =
    getPadding();

  const width =
    isMobile()
      ? Math.min(
          292,
          window.innerWidth -
            edge * 2,
        )
      : 320;

  const estimatedHeight =
    isMobile()
      ? 166
      : 174;

  const gap =
    isMobile()
      ? 7
      : 12;


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
   ELEMENT HELPERS
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
  element:
    HTMLElement,
) {
  const rect =
    element.getBoundingClientRect();


  return (
    rect.width >
      0 &&
    rect.height >
      0 &&
    rect.bottom >
      0 &&
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
    (node) => {
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
  element:
    HTMLElement,
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


  /*
   * Header dùng z-[220].
   * Target chỉ z30 nên không
   * bao giờ đè navigation.
   */
  element.style.zIndex =
    "30";


  element.style.outline =
    "2px solid rgba(52,211,153,.78)";


  element.style.outlineOffset =
    "5px";


  element.style.boxShadow =
    "0 0 0 5px rgba(52,211,153,.09)";


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
    return (
      DEFAULT_SCNC_SETTINGS
    );
  }


  try {
    return {
      ...DEFAULT_SCNC_SETTINGS,

      ...JSON.parse(
        raw,
      ),
    };
  } catch {
    return (
      DEFAULT_SCNC_SETTINGS
    );
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


  const scrollFrame =
    useRef<
      number | null
    >(null);


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


/* =========================================================
   FIND STEP AT CURRENT VIEWPORT
========================================================= */

  const findCurrentStepIndex =
    useCallback(() => {
      if (
        routeSteps.length ===
        0
      ) {
        return 0;
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
          /*
           * Page introduction chỉ được
           * chọn khi đang gần đầu trang.
           */
          if (
            step.trigger ===
              "page"
          ) {
            if (
              window.scrollY <
                160
            ) {
              const distance =
                index;

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


            /*
             * Element phải thực sự nằm
             * trong viewport.
             */
            if (
              rect.bottom <=
                0 ||
              rect.top >=
                window.innerHeight
            ) {
              continue;
            }


            /*
             * Section cắt qua probe line.
             */
            if (
              rect.top <=
                probe &&
              rect.bottom >=
                probe
            ) {
              const bonus =
                step.trigger ===
                  "visible"
                  ? 5
                  : 0;


              const score =
                bonus;


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


            /*
             * Với button / video / CTA,
             * ưu tiên hơn section cha
             * khi cùng visible.
             */
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
              bestDistance =
                distance;

              bestIndex =
                index;
            }
          }
        },
      );


      /*
       * QUAN TRỌNG:
       *
       * Nếu không có gì được track
       * trong viewport → trả null.
       *
       * Không return 0.
       * Không quay về Hero.
       */
      return bestIndex;
    }, [
      routeSteps,
    ]);


/* =========================================================
   MOVE
========================================================= */

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


/* =========================================================
   INITIAL / ROUTE CHANGE
========================================================= */

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


    /*
     * Route mới:
     * chọn step phù hợp với nơi
     * user đang nhìn, không mặc định
     * luôn là Hero.
     */
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


          const initialIndex =
            detected ??
            0;


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

        120,
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
    };
  }, [
    findCurrentStepIndex,
    moveToStep,
    pathname,
    routeSteps,
  ]);


/* =========================================================
   SCROLL DETECTION
========================================================= */

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
      const detected =
        findCurrentStepIndex();


      /*
       * Đây là fix lỗi Hero.
       *
       * Không có tracked section
       * ở viewport → KHÔNG thay step.
       */
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


/* =========================================================
   STEP CHANGE
========================================================= */

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


/* =========================================================
   STOP GUIDE
========================================================= */

  function stopGuidance() {
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
        "manual",
    });


    setPosition(
      getCornerPosition(
        "bottom-right",
      ),
    );
  }


/* =========================================================
   CONTINUE GUIDE

   Không scroll.
   Không về Hero.

   Xác định đúng section hiện user đang xem,
   rồi tiếp tục từ đó.
========================================================= */

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


    /*
     * Nếu user đang đúng một tracked area,
     * tiếp tục ngay tại đó.
     *
     * Nếu đang ở khoảng trống,
     * giữ step cuối cùng thay vì Hero.
     */
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


/* =========================================================
   HIDE / SHOW
========================================================= */

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


/* =========================================================
   EARLY RETURN
========================================================= */

  if (!mounted) {
    return null;
  }


/* =========================================================
   HIDDEN MODE
========================================================= */

  if (
    settings.guidance ===
    "off"
  ) {
    return (
      <>
        {pathname !==
          "/" && (
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

          className="fixed bottom-4 right-4 z-[190] flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/45 px-3 py-2 text-xs font-semibold text-white/75 shadow-lg backdrop-blur-md"
        >
          <Image
            src="/scnc.png"

            alt=""

            width={24}

            height={24}

            unoptimized
          />

          SCNC
        </button>
      </>
    );
  }


/* =========================================================
   RENDER VALUES
========================================================= */

  const size =
    getMascotSize();


  const dialog =
    getDialogPosition(
      position,
    );


/* =========================================================
   RENDER
========================================================= */

  return (
    <>
      {/* =================================================
          BACK TO MAIN WEBSITE
      ================================================= */}

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


      {/* =================================================
          MASCOT
      ================================================= */}

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

              className="h-[82px] w-[82px] object-contain drop-shadow-[0_8px_15px_rgba(0,0,0,.20)] md:h-[108px] md:w-[108px]"
            />
          </button>
        </div>
      </div>


      {/* =================================================
          ACTIVE DIALOG
      ================================================= */}

      {tourActive &&
        currentStep && (
          <div
            className="fixed z-[190] rounded-2xl border border-white/10 bg-slate-950/38 p-3.5 text-white shadow-[0_12px_30px_rgba(0,0,0,.14)] backdrop-blur-md"

            style={{
              ...dialog,

              transition:
                `left ${MOVE_DURATION}ms cubic-bezier(.22,1,.36,1), top ${MOVE_DURATION}ms cubic-bezier(.22,1,.36,1)`,
            }}
          >
            <div className="mb-2 flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />


              <span className="text-[11px] font-bold tracking-[0.15em] text-emerald-300">
                SCNC
              </span>


              <span className="ml-auto text-[10px] text-white/30">
                {stepIndex + 1}
                /
                {
                  routeSteps.length
                }
              </span>
            </div>


            <p className="text-sm leading-6 text-white/85">
              {t(
                currentStep.message,
              )}
            </p>


            <button
              type="button"

              onClick={
                stopGuidance
              }

              className="mt-3 text-xs text-white/40 transition hover:text-white/75"
            >
              {t(
                SCNC_COPY
                  .stopGuide,
              )}
            </button>
          </div>
        )}


      {/* =================================================
          MANUAL MENU
      ================================================= */}

      {!tourActive &&
        menuOpen && (
          <div className="fixed bottom-[126px] right-3 z-[190] w-[230px] rounded-2xl border border-white/10 bg-slate-950/45 p-2 text-white shadow-xl backdrop-blur-md md:right-5">

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


      {/* =================================================
          ANIMATION
      ================================================= */}

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
              translateY(-5px)
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
              translateY(-8px)
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