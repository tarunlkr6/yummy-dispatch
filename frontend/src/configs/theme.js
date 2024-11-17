export const materialTheme = {
  button: {
    defaultProps: {
      color: "black",
      size: "sm",
      ripple: true,
    },
    styles: {
      base: {
        initial: {
          textTransform: "none",
        },
      },
    },
  },
  iconButton: {
    defaultProps: {
      color: "black",
      size: "sm",
      ripple: true,
    },
    styles: {
      base: {
        initial: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      },
    },
  },
  dialog: {
    defaultProps: {
      size: "md",
      dismiss: {},
    },
    styles: {
      base: {
        backdrop: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  },
};