function Footer() {
  return (
    <footer className="relative bg-[#000] px-10 pt-5 pb-10">
      <div className="border-white/10 border-t pt-10">
        <ul className="grid w-full grid-cols-2 justify-between gap-x-2 gap-y-10 font-light text-white/40 text-xs uppercase tracking-widest sm:flex sm:flex-row sm:gap-0">
          <li>Greg Nicholson.</li>
          <li className="text-right sm:text-left">Senior Developer.</li>
          <li className="col-span-2 text-center">Based in London.</li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
