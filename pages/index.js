import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
// import MDEditor from "@uiw/react-md-editor";
import styles from "../styles/Home.module.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import rehypeSanitize from "rehype-sanitize";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import slugify from "react-slugify";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

function HomePage() {
  const defaultTemplateFrontmatter = `---
title: 
description: 
date: 2022-03-04 11:43:35
isFeatured: false
isNewsletter: true
path: 
author: 
authorImage: 
image:
socialCard:
team:
hideAuthor: false
---
`;

  const [value, setValue] = useState();
  const [defaultFrontmatter, setDefaultFrontmatter] = useState(
    defaultTemplateFrontmatter
  );
  const [fileName, setFileName] = useState();

  // const fileDate = new Date();

  const slugifyFileName = slugify(fileName, {
    delimiter: "-",
  });

  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([defaultFrontmatter, value], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = slugifyFileName+'.md'
    document.body.appendChild(element);
    element.click();
  };

  const title = "Instant Markdown Editor ⚡️";
  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Create your instant markdown file." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center place-content-between ">
        <h1 className="text-3xl mt-2 font-bold mb-8 font-mono">{title}</h1>
        <span className="text-xs">
          {" "}
          <a target="_blank" href="https://www.markdownguide.org/cheat-sheet">
            Markdown cheatsheet
          </a>
        </span>
      </div>
      <div className="w-full pt-2">
        <div className="w-full p-2 bg-white rounded-2xl">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75">
                  <span>Settings</span>
                  <ChevronUpIcon
                    className={`${
                      open ? "transform rotate-180" : ""
                    } w-5 h-5 text-gray-500`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                  <section>
                    <textarea
                      type="text"
                      onChange={(e) => setDefaultFrontmatter(e.target.value)}
                      value={defaultFrontmatter}
                      className="text-base w-full h-96 bg-gray-900 text-white p-2 rounded-lg"
                    />
                  </section>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </div>

      <MDEditor
        value={value}
        onChange={setValue}
        className="m-2"
        height={500}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />

      <div className="flex items-baseline place-content-end gap">
        <div className="mt-1 flex rounded-md">
          <input
            type="text"
            className="border border-gray-200 mr-2 px-4 py-2 focus:ring-indigo-200 focus:border-indigo-200 flex-1 block w-full sm:text-sm rounded-md "
            placeholder="Write your file name"
            onChange={(e) => setFileName(e.target.value)}
            value={fileName}
          />
        </div>

        <button
          type="button"
          className="float-right mt-12 px-4 py-2 text-sm font-medium text-left text-green-900 bg-green-100 rounded-lg hover:bg-green-200 focus:outline-none focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75"
          onClick={downloadTxtFile}
        >
          Download
        </button>
      </div>
      <footer className="text-xs mt-8">
        <a href="https://raufsamestone.com" target="_blank">
          raufsamestone.com
        </a>{" "}
        © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default HomePage;
