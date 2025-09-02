declare module 'gifshot' {
  const gifshot: {
    createGIF: (
      options: any,
      callback: (result: { error?: boolean; errorMsg?: string; image?: string }) => void
    ) => void;
  };
  export default gifshot;
}


