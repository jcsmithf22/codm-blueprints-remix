import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RemoveScroll } from "react-remove-scroll";
import FocusLock from "react-focus-lock";
import { Link } from "@remix-run/react";

type MenuContext = {
  isOpen: boolean;
  submenuState: {
    [key: string]: boolean;
  };
  closeMenu: () => void;
  openMenu: () => void;
  toggleSubmenuState: (id: string) => void;
  navigationItems: NavigationItem[];
};

const menuStateContext = React.createContext<MenuContext>({
  isOpen: false,
  closeMenu: () => {},
  openMenu: () => {},
  toggleSubmenuState: () => {},
  submenuState: {},
  navigationItems: [],
});

const MenuStateProvider = ({
  children,
  navigationItems,
}: {
  children: React.ReactNode;
  navigationItems: NavigationItem[];
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [submenuState, setSubmenuState] = React.useState<{
    [key: string]: boolean;
  }>(() => {
    const state: { [key: string]: boolean } = {};
    navigationItems.forEach((item) => {
      if (item.subitems) {
        state[item.id] = false;
      }
    });
    return state;
  });

  const closeMenu = React.useCallback(() => {
    setIsOpen(false);
    setSubmenuState(() => {
      const state: { [key: string]: boolean } = {};
      navigationItems.forEach((item) => {
        if (item.subitems) {
          state[item.id] = false;
        }
      });
      return state;
    });
  }, [navigationItems]);

  const openMenu = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const toggleSubmenuState = React.useCallback((id: string) => {
    setSubmenuState((state) => ({
      ...state,
      [id]: !state[id],
    }));
  }, []);

  const value = React.useMemo(
    () => ({
      isOpen,
      submenuState,
      closeMenu,
      openMenu,
      toggleSubmenuState,
      navigationItems,
    }),
    [
      isOpen,
      submenuState,
      closeMenu,
      openMenu,
      toggleSubmenuState,
      navigationItems,
    ]
  );
  return (
    <menuStateContext.Provider value={value}>
      {children}
    </menuStateContext.Provider>
  );
};

const menuContainerVariant = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at calc(100vw - 32px) 32px)`,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(0px at calc(100vw - 28px) 28px)",
    // i want opacity to fade to zero right at the end of the animation
    // how do i do this?
    opacity: 0,
    transition: {
      delay: 0.25,
      type: "spring",
      stiffness: 400,
      restDelta: 0.01,
      damping: 40,
      opacity: {
        delay: 0.55,
        duration: 0.125,
        ease: "easeOut",
      },
    },
  },
};

type NavigationItem = {
  title: string;
  url: string;
  id: string;
  subitems?: NavigationItem[];
};

function MobileMenu({
  navigationItems,
}: {
  navigationItems: NavigationItem[];
}) {
  return (
    <MenuStateProvider navigationItems={navigationItems}>
      <MobileMenuChildren />
    </MenuStateProvider>
  );
}

// help me write a focus wrap locker that only exists in the browser
const FocusLockWrapper = ({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled: boolean;
}) => {
  const [isBrowser, setIsBrowser] = React.useState(false);

  React.useEffect(() => {
    setIsBrowser(true);
  }, []);
  if (isBrowser) {
    return <FocusLock disabled={disabled}>{children}</FocusLock>;
  }
  return <>{children}</>;
};

function MobileMenuChildren() {
  const { isOpen, closeMenu, openMenu } = React.useContext(menuStateContext);
  return (
    <RemoveScroll enabled={isOpen}>
      <FocusLockWrapper disabled={!isOpen}>
        <motion.div
          initial={false}
          animate={isOpen ? "open" : "closed"}
          className="fixed flex right-2 top-2 z-50 mix-blend-difference stroke-white"
        >
          <MenuToggle
            className="flex items-center justify-center h-10 w-10 rounded-full cursor-pointer"
            toggle={() => (isOpen ? closeMenu() : openMenu())}
          />
        </motion.div>
        <motion.div
          initial={false}
          animate={isOpen ? "open" : "closed"}
          variants={menuContainerVariant}
          className="bg-black fixed inset-0"
        >
          <AnimatePresence>
            {isOpen && <MobileMenuItems key="menu-items" />}
          </AnimatePresence>
        </motion.div>
      </FocusLockWrapper>
    </RemoveScroll>
  );
}

type PathProps = React.ComponentProps<typeof motion.path>;

const Path = (props: PathProps) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="inherit"
    strokeLinecap="round"
    {...props}
  />
);

type ButtonProps = React.ComponentPropsWithRef<"button"> & {
  toggle: () => void;
};

export const MenuToggle = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ toggle, ...delegated }, forwardedRef) => (
    <button ref={forwardedRef} onClick={toggle} {...delegated}>
      <svg width="23" height="23" viewBox="0 0 23 23" className="mt-1 ml-0.5">
        <Path
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" },
          }}
        />
        <Path
          d="M 2 9.423 L 20 9.423"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.1 }}
        />
        <Path
          variants={{
            closed: { d: "M 2 16.346 L 20 16.346" },
            open: { d: "M 3 2.5 L 17 16.346" },
          }}
        />
      </svg>
      <span className="sr-only">Toggle Mobile Menu</span>
    </button>
  )
);

MenuToggle.displayName = "MenuToggle";

const menuListVariant = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const menuItemVariant = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const MobileMenuItems = () => {
  const { navigationItems } = React.useContext(menuStateContext);
  return (
    <motion.ul
      initial="closed"
      animate="open"
      exit="closed"
      variants={menuListVariant}
      className="list-none p-0 m-0 mt-40 px-8"
    >
      {navigationItems.map((item) => (
        <MobileMenuItem
          key={item.id}
          title={item.title}
          url={item.url}
          id={item.id}
          subitems={item.subitems}
        />
      ))}
    </motion.ul>
  );
};

const MobileMenuItem = ({
  title,
  url,
  id,
  subitems,
}: {
  title: string;
  url: string;
  id: string;
  subitems?: NavigationItem[] | undefined;
}) => {
  const { submenuState, toggleSubmenuState, closeMenu } =
    React.useContext(menuStateContext);
  const isOpen = submenuState[id];

  return (
    <>
      <motion.li
        layoutId={id}
        key={id}
        variants={menuItemVariant}
        className="block text-white text-2xl mb-6"
      >
        {subitems ? (
          <motion.button
            className="flex flex-row justify-between w-full cursor-pointer"
            onClick={() => toggleSubmenuState(id)}
          >
            {title}
            <svg
              className={`${
                isOpen ? "transform rotate-180" : ""
              } transition-transform`}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              width={24}
              height={24}
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </motion.button>
        ) : (
          <Link onClick={() => closeMenu()} to={url}>
            {title}
          </Link>
        )}
      </motion.li>
      <AnimatePresence mode="popLayout">
        {isOpen && subitems && (
          <SubmenuItems
            key={`${id}-subitems`}
            subitems={subitems}
            isOpen={isOpen}
          />
        )}
      </AnimatePresence>
    </>
  );
};

type SubmenuItemsProps = {
  subitems: NavigationItem[];
  isOpen: boolean;
};

const SubmenuItems = React.forwardRef<HTMLUListElement, SubmenuItemsProps>(
  ({ subitems, isOpen }, forwardedRef) => {
    return (
      <motion.ul
        ref={forwardedRef}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        exit="closed"
        variants={menuListVariant}
        className="list-none p-0 px-8"
      >
        {subitems.map((item) => (
          <motion.li
            key={item.id}
            variants={menuItemVariant}
            className="block text-white font-xl mb-6"
          >
            <Link to={item.url}>{item.title}</Link>
          </motion.li>
        ))}
      </motion.ul>
    );
  }
);

SubmenuItems.displayName = "SubmenuItems";

export default React.memo(MobileMenu);
