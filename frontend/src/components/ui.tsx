import React, { useState, createContext, useContext } from "react";
import ReactDOM from "react-dom";

// ─── Button ─────────────────────────────────────────────────────────────────
type ButtonProps<C extends React.ElementType> = {
  as?: C;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
} & React.ComponentPropsWithoutRef<C>;

export const Button = <C extends React.ElementType = "button">({
  as,
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps<C>) => {
  const Component = as || "button";

  const base =
    "px-4 py-2 sm:px-5 sm:py-2.5 font-black uppercase tracking-wide transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 text-sm sm:text-base border-4 border-[var(--border)] rounded-none cursor-pointer";

  const variants: Record<string, string> = {
    primary:
      "bg-[var(--nb-yellow)] text-black shadow-[var(--shadow-sm)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none active:translate-y-1 active:translate-x-1",
    secondary:
      "bg-[var(--surface-2)] text-[var(--text)] shadow-[var(--shadow-sm)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none active:translate-y-1 active:translate-x-1",
    danger:
      "bg-[var(--nb-pink)] text-white shadow-[var(--shadow-sm)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none active:translate-y-1 active:translate-x-1",
    ghost:
      "bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-2)] border-transparent hover:border-[var(--border)]",
  };

  return (
    <Component
      className={`${base} ${variants[variant]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </Component>
  );
};

// ─── Card ────────────────────────────────────────────────────────────────────
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = "", style, ...props }) => (
  <div
    className={`nb-card p-6 theme-transition rounded-none ${className}`}
    style={style}
    {...props}
  >
    {children}
  </div>
);

// ─── Spinner ─────────────────────────────────────────────────────────────────
export const Spinner = () => (
  <div className="animate-spin h-5 w-5 border-4 border-t-transparent border-[var(--border-2)]" />
);

// ─── Modal ───────────────────────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-start p-4 bg-black/50 backdrop-blur-sm sm:pt-16"
      onClick={onClose}
    >
      <div
        className="bg-[var(--surface)] border-4 border-[var(--border)] shadow-[var(--shadow-lg)] rounded-none w-full max-w-2xl max-h-[90vh] flex flex-col pointer-events-auto overflow-hidden theme-transition animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b-4 border-[var(--border)] bg-[var(--nb-yellow)] text-black flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-black uppercase">{title}</h2>
          <button
            onClick={onClose}
            className="text-black hover:bg-black/10 w-8 h-8 rounded-none flex items-center justify-center text-2xl font-black leading-none transition-colors cursor-pointer"
          >
            &times;
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar text-[var(--text)]">{children}</div>
      </div>
    </div>
  );
};

// ─── Toast ───────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "info";
interface ToastMessage { id: number; message: string; type: ToastType; }
interface ToastContextType { addToast: (message: string, type: ToastType) => void; }

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastType) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((cur) => cur.filter((t) => t.id !== id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {ReactDOM.createPortal(
        <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm">
          {toasts.map((toast) => <Toast key={toast.id} {...toast} />)}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

const Toast: React.FC<ToastMessage> = ({ message, type }) => {
  const colors: Record<ToastType, string> = {
    success: "bg-[var(--nb-green)] text-black",
    error: "bg-[var(--nb-pink)] text-white",
    info: "bg-[var(--nb-blue)] text-black",
  };
  return (
    <div className={`px-5 py-3 border-4 border-black shadow-[var(--shadow)] font-black uppercase rounded-none ${colors[type]} animate-slideIn`}>
      {message}
    </div>
  );
};

// ─── Tabs ────────────────────────────────────────────────────────────────────
interface TabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 pb-2 border-b-4 border-[var(--border)] mb-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-4 py-2 font-black uppercase tracking-wide
              text-sm sm:text-base border-4 border-[var(--border)] rounded-none
              transition-all duration-150 cursor-pointer
              ${isActive
                ? "bg-[var(--nb-yellow)] text-black translate-x-0 translate-y-0 shadow-none border-[var(--border)]"
                : "bg-[var(--surface-2)] text-[var(--text)] shadow-[var(--shadow-sm)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none"
              }
            `}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};
