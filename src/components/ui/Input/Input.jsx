import React, { useId } from "react";
import styles from "./Input.module.css";

export function Input({
  label,
  error,
  type = "text",
  className = "",
  disabled = false,
  ...props
}) {
  const id = useId();
  const isTextarea = type === "textarea";

  return (
    <div className={`${styles.container} ${className} ${disabled ? styles.disabled : ""}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {isTextarea ? (
          <textarea
            id={id}
            disabled={disabled}
            className={`${styles.input} ${styles.textarea} ${error ? styles.inputError : ""}`}
            {...props}
          />
        ) : (
          <input
            id={id}
            type={type}
            disabled={disabled}
            className={`${styles.input} ${error ? styles.inputError : ""}`}
            {...props}
          />
        )}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
