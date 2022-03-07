import Head from "next/head";
import { useState } from "react";
// import styles from "../styles/Home.module.css";
// import Nestable from "react-nestable";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import rehypeSanitize from "rehype-sanitize";
import { Disclosure, Tab } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import slugify from "react-slugify";
import { useEffect } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "react-nestable/dist/styles/index.css";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

function HomePage() {
  const today = new Date().toISOString().split("T")[0];

  const defaultTemplateFrontmatter = `---
title: 
description:
date: ${today}
path: 
author: 
image:
---
`;

  const [value, setValue] = useState();
  const [notification, setNotification] = useState(false);

  const [defaultFrontmatter, setDefaultFrontmatter] = useState(
    defaultTemplateFrontmatter
  );

  const [fileName, setFileName] = useState();

  const createdFrontmatter = defaultFrontmatter.replace(/,/g, "\n");
  // const fileDate = new Date();

  const slugifyFileName = slugify(fileName, {
    delimiter: "-",
  });
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const downloadMD = () => {
    const element = document.createElement("a");
    const file = new Blob([createdFrontmatter, value], {
      type: "text/plain",
    });
    const fileStructure = slugifyFileName + ".md";
    element.href = URL.createObjectURL(file);
    element.download = fileStructure;
    document.body.appendChild(element);
    element.click();
  };

  const title = "Instant Markdown Editor";
  const description =
    "For developers and who don't like to duplicate old markdown files.";

  const [data, setData] = useState([]);
  const [displayForm, setDisplayForm] = useState(false);
  const [newFrontMatterItem, setNewFrontMatterItem] = useState({
    key: "",
    value: "",
  });

  const createFrontMatterItem = () => {
    setData([...data, { id: data.length + 1, ...newFrontMatterItem }]);
    setNewFrontMatterItem({ name: "" });
    setDisplayForm(false);
  };

  function handleRemove(id) {
    const newFrontMatterItem = data.filter((item) => item.id !== id);
    setData(newFrontMatterItem);
  }

  const handleOnChange = (e) => {
    const slugifyValue = slugify(e.target.value, {
      delimiter: "-",
    });

    const dynamicValue = e.target.value === "today" ? today : e.target.value;

    setNewFrontMatterItem({
      ...newFrontMatterItem,
      [e.target.name]: dynamicValue,
    });
  };

  const save = () => {
    let regex = /,/g;
    setDefaultFrontmatter(
      `--- \n` +
        data.map(
          (frontMatterItem) =>
            frontMatterItem.key +
            ": " +
            frontMatterItem.value.replace(regex, "\n")
        ) +
        `\n---`
    ),
      setNotification(true);
    setTimeout(() => {
      setNotification(false);
    }, 1000);
  };

  let saveFrontMatter = () => {
    localStorage.setItem("markdown", [createdFrontmatter, value]);
    setNotification(true);
    setTimeout(() => {
      setNotification(false);
    }, 1000);
  };
  let loadFrontMatter = () => {
    setDefaultFrontmatter(localStorage.getItem("markdown", createdFrontmatter));
  };

  return (
    <div className="w-full max-w-4xl m-auto">
      <Head>
        <title>{title} </title>
        <meta name="description" content="Create your instant markdown file." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex items-center place-content-between mb-12 ">
        <div className="">
          <h1 className="text-3xl mt-2 font-bold mb-8 font-mono">{title}</h1>
          <p className="text-sm -mt-4  font-mono">{description}</p>
        </div>
        <span className="text-xs m-2 text-gray-600 hover:text-gray-800">
          <a
            target="_blank"
            href="https://github.com/raufsamestone/instant-markdown-editor/"
          >
            GitHub
          </a>
        </span>
      </div>
      <div className="w-full pt-2">
        <div className="w-full p-2 bg-white rounded-2xl">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75">
                  <span>Frontmatter</span>
                  <ChevronUpIcon
                    className={`${
                      open ? "transform rotate-180" : ""
                    } w-5 h-5 text-gray-500`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                  <div className="w-full max-w-4xl m-auto">
                    <Tab.Group>
                      <Tab.List className="flex p-1 space-x-1 bg-gray-900 rounded-xl">
                        <Tab
                          key="Advanced"
                          className={({ selected }) =>
                            classNames(
                              "w-full py-2.5 text-sm leading-5 font-medium text-gray-700 rounded-lg",
                              "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-400 ring-white ring-opacity-60",
                              selected
                                ? "bg-white shadow"
                                : "text-gray-100 hover:bg-white/[0.12] hover:text-white"
                            )
                          }
                        >
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              class="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                              ></path>
                            </svg>{" "}
                            Advanced
                          </span>
                        </Tab>
                        <Tab
                          key="create-new"
                          className={({ selected }) =>
                            classNames(
                              "w-full py-2.5 text-sm leading-5 font-medium text-gray-700 rounded-lg",
                              "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-400 ring-white ring-opacity-60",
                              selected
                                ? "bg-white shadow"
                                : "text-gray-100 hover:bg-white/[0.12] hover:text-white"
                            )
                          }
                        >
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              class="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                              ></path>
                            </svg>
                            Create
                          </span>
                        </Tab>
                      </Tab.List>
                      <Tab.Panels className="mt-2">
                        <Tab.Panel
                          key=""
                          className={classNames(
                            "bg-white rounded-xl p-3",
                            "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-400 ring-white ring-opacity-60"
                          )}
                        >
                          <ul>
                            <li
                              key=""
                              className="relative p-3 rounded-md hover:bg-coolGray-100"
                            >
                              <p className="text-sm mb-3">
                                Paste your <code>yaml</code> frontmatter.
                              </p>
                              <section>
                                <textarea
                                  type="text"
                                  onChange={(e) =>
                                    setDefaultFrontmatter(e.target.value)
                                  }
                                  value={createdFrontmatter}
                                  className="text-base w-full h-96 bg-gray-900 text-white p-2 rounded-lg"
                                />
                                <div className="float-right flex gap-2">
                                  <button onClick={saveFrontMatter}>
                                    {!notification ? "Save" : "Saved! 🎉"}
                                  </button>
                                  <button onClick={loadFrontMatter}>
                                    Restore
                                  </button>
                                </div>
                              </section>
                            </li>
                          </ul>
                        </Tab.Panel>
                        <Tab.Panel
                          key=""
                          className={classNames(
                            "bg-white rounded-xl p-3",
                            "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-400 ring-white ring-opacity-60"
                          )}
                        >
                          <ul>
                            <li key="" className="relative p-3 rounded-md">
                              <p className="text-sm mb-3">
                                Create a new frontmatter.
                              </p>
                              <section>
                                {/*
                                TODO - add a drag to select the type of frontmatter to create nested yaml
                                 <Nestable
                                  onChange={handleMoveChange}
                                  items={data}
                                  className="flex mb-2 justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg  focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75"
                                  renderItem={renderItem}
                                /> */}
                                <div>
                                  {data.map((row) => (
                                    <div
                                      key={row.id}
                                      className="flex mb-2 justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg  focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75"
                                    >
                                      {row.key}: {row.value}
                                      <button
                                        type="button"
                                        onClick={() => handleRemove(row.id)}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          class="h-6 w-6"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                          stroke-width="2"
                                        >
                                          <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  ))}

                                  {displayForm ? (
                                    <div className="flex">
                                      <input
                                        placeholder="key"
                                        className="border border-gray-200 mr-2 px-4 py-2 focus:ring-indigo-200 focus:border-indigo-200 flex-1 block w-auto sm:text-sm rounded-md "
                                        onChange={handleOnChange}
                                        value={newFrontMatterItem.key}
                                        required={true}
                                        name="key"
                                      />
                                      <input
                                        className="border border-gray-200 mr-2 px-4 py-2 focus:ring-indigo-200 focus:border-indigo-200 flex-1 block w-auto sm:text-sm rounded-md "
                                        placeholder="value"
                                        required={true}
                                        onChange={handleOnChange}
                                        value={newFrontMatterItem.value}
                                        name="value"
                                      />

                                      <button
                                        onClick={createFrontMatterItem}
                                        className="w-auto flex float-right px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75"
                                      >
                                        Add{" "}
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          class="h-5 w-5"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fill-rule="evenodd"
                                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                            clip-rule="evenodd"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        setDisplayForm(!displayForm)
                                      }
                                      className="float-right px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75"
                                    >
                                      Create a new row
                                    </button>
                                  )}
                                </div>
                                <button
                                  onClick={save}
                                  className="mt-2 m-auto  px-4 py-2 text-sm font-medium text-left text-green-900 bg-green-100 rounded-lg hover:bg-green-200 focus:outline-none focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75"
                                >
                                  {!notification ? "Save" : "Saved! 🎉"}
                                </button>
                              </section>
                            </li>
                          </ul>
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
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
        height={300}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
      <span className="text-xs m-2 text-gray-600 hover:text-gray-800">
        {" "}
        <a target="_blank" href="https://www.markdownguide.org/cheat-sheet">
          You are not familiar Markdown?
        </a>
      </span>
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
          onClick={downloadMD}
        >
          Download
        </button>
      </div>
      <span className="block float-right mt-2 text-gray-600 text-xs ">
        Your file will be named like this:{" "}
        <span className="font-bold">{slugifyFileName + ".md"}</span>
      </span>
      <footer className="text-xs mt-8 text-xs m-2 text-gray-600">
        <a
          href="https://raufsamestone.com?utm_source=markdown-editor"
          className="text-gray-600 hover:text-gray-800"
          target="_blank"
        >
          raufsamestone.com
        </a>{" "}
        © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default HomePage;
