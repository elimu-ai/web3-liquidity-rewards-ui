export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <>
    <footer className="flex flex-col items-center justify-center w-full py-6 border-t mt-10 ">
      <div className="text-sm">
        Made with <span aria-hidden>💜</span> by&nbsp;
        <a
          href="https://elimu.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 underline hover:no-underline"
          aria-label="Visit elimu.ai"
        >
          elimu.ai
        </a>
        &nbsp;·&nbsp;
        <a
          href="https://github.com/elimu-ai/web3-liquidity-rewards-ui"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 underline hover:no-underline"
          aria-label="View source on GitHub"
        >
          Source (GitHub)
        </a>
      </div>
      <div className="text-xs text-gray-400 mt-1">© {year}</div>
    </footer>
    </>
  );
}
