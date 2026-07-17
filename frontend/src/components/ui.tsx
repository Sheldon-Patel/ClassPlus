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
    "px-4 py-2 sm:px-5 sm:py-2.5 font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 text-sm sm:text-base border uppercase tracking-wider rounded-lg cursor-pointer";

  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-[var(--accent)] to-[#4f46e5] hover:from-[#4f46e5] hover:to-[var(--accent)] text-white shadow-md hover:shadow-lg border-transparent transform hover:-translate-y-0.5 active:translate-y-0",
    secondary:
      "bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--text)] border-[var(--border)] shadow-sm hover:-translate-y-0.5 active:translate-y-0",
    danger:
      "bg-gradient-to-r from-[var(--error)] to-[#ff6b6b] hover:from-[#d32f2f] hover:to-[var(--error)] text-white shadow-md hover:shadow-lg border-transparent transform hover:-translate-y-0.5 active:translate-y-0",
    ghost:
      "bg-transparent hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] border-transparent",
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
    className={`bg-[var(--surface)] border border-[var(--border-subtle)] rounded-2xl shadow-sm p-6 transition-all duration-300 hover:shadow-md ${className}`}
    style={style}
    {...props}
  >
    {children}
  </div>
);

// ─── Spinner ─────────────────────────────────────────────────────────────────
export const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--accent)]" />
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
      className="fixed inset-0 z-50 flex justify-center items-start p-4 bg-slate-900/40 backdrop-blur-sm sm:pt-16"
      onClick={onClose}
    >
      <div
        className="bg-[var(--surface)] border border-[var(--border)] shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col pointer-events-auto overflow-hidden theme-transition animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[var(--border-subtle)] bg-[var(--surface-2)] flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text)]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text)] w-8 h-8 rounded-full flex items-center justify-center text-xl leading-none hover:bg-[var(--surface-3)] transition-colors cursor-pointer"
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
    success: "bg-[var(--nb-green)] text-black border-transparent",
    error: "bg-[var(--accent)] text-white border-transparent",
    info: "bg-[var(--nb-blue)] text-white border-transparent",
  };
  return (
    <div className={`px-5 py-3 border rounded-xl shadow-xl font-bold uppercase ${colors[type]} animate-slideIn`}>
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
    <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-subtle)] pb-2 mb-4">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-4 py-2 text-sm sm:text-base font-semibold uppercase tracking-wider
              transition-all duration-200 border-b-2 -mb-[10px] cursor-pointer
              ${isActive
                ? "border-[var(--accent)] text-[var(--accent)] font-black"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
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
