"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, Store, X } from "lucide-react";

import { fadeIn } from "@/constants/motionVariants";
import { categoriesIcons } from "@/constants/categoriesIcons";
import { ApplicationContext } from "@/context/ApplicationContext";
import { useAuth } from "@/hook/useAuth";

interface SearchInputProps {
  visibleMobile?: boolean;
}

export default function SearchInput({
  visibleMobile = false,
}: SearchInputProps) {
  const { categories, searchTerm, searchCompanies } =
    useAuth(ApplicationContext);

  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [dropdownStyle, setDropdownStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const inputContainerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = useMemo(() => {
    const normalize = (value: string) =>
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR")
        .trim();

    const term = normalize(searchTerm);

    if (!term) return [];

    return categories
      .filter((category) => normalize(category.name).includes(term))
      .slice(0, 5);
  }, [categories, searchTerm]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !searchTerm.trim()) return;

    const updatePosition = () => {
      const element = inputContainerRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();

      setDropdownStyle({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, searchTerm]);

  function handleSearch() {
    setIsOpen(false);
    router.push("/catalogo");
  }

  function handleCategorySelect(slug: string) {
    searchCompanies("");
    setIsOpen(false);

    router.push(`/catalogo?categoria=${encodeURIComponent(slug)}`);
  }

  function handleClearSearch() {
    searchCompanies("");
    setIsOpen(false);
  }

  return (
    <motion.div
      variants={fadeIn}
      className={`relative w-full max-w-xl ${
        visibleMobile ? "flex" : "hidden lg:flex"
      }`}
    >
      {/* Campo de pesquisa */}
      <div
        ref={inputContainerRef}
        className="focus-within:ring-marca1 border-marca1/40 bg-card relative z-20 flex h-14 w-full items-center rounded-2xl border shadow-md transition-all duration-300 focus-within:ring-1"
      >
        <div className="text-marca1 pointer-events-none ml-4">
          <Search className="h-5 w-5" />
        </div>

        <input
          type="text"
          value={searchTerm}
          placeholder="O que você está procurando?"
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen && filteredSuggestions.length > 0}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
          onChange={(event) => {
            searchCompanies(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsOpen(false);
            }

            if (event.key === "Enter") {
              event.preventDefault();
              handleSearch();
            }
          }}
          className="text-text placeholder:text-text/40 h-full w-full min-w-0 bg-transparent px-4 outline-none"
        />

        {searchTerm && (
          <button
            type="button"
            aria-label="Limpar pesquisa"
            onClick={handleClearSearch}
            className="text-text/50 hover:text-marca1 mr-2 rounded-lg p-2 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          onClick={handleSearch}
          className="group bg-marca1 text-text2 hover:bg-marca mr-1 flex h-12 shrink-0 items-center gap-2 rounded-xl px-5 font-semibold transition-colors duration-300"
        >
          Buscar
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Sugestões de categorias */}
      {mounted &&
        isOpen &&
        searchTerm.trim() &&
        createPortal(
          <div
            id="search-suggestions"
            style={{
              position: "fixed",
              top: dropdownStyle.top,
              left: dropdownStyle.left,
              width: dropdownStyle.width,
              zIndex: 99999,
            }}
            className="border-marca1/30 bg-card overflow-hidden rounded-2xl border shadow-xl"
          >
            {filteredSuggestions.length > 0 ? (
              <ul className="py-2">
                <li className="text-text/50 px-4 py-2 text-xs font-semibold tracking-wider uppercase">
                  Sugestões de categorias
                </li>

                {filteredSuggestions.map((category) => {
                  const Icon = categoriesIcons[category.slug] ?? Store;

                  return (
                    <li key={category.id}>
                      <button
                        type="button"
                        onClick={() => handleCategorySelect(category.slug)}
                        className="hover:bg-marca1/10 flex w-full items-center gap-3 px-4 py-3 text-left transition-colors"
                      >
                        <span className="bg-marca1/15 text-marca flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                          <Icon className="h-4 w-4" />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="text-text block truncate text-sm font-medium">
                            {category.name}
                          </span>

                          <span className="text-text/50 block text-xs">
                            {category.companiesCount} empresas
                          </span>
                        </span>

                        <ArrowRight className="text-text/40 h-4 w-4 shrink-0" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex items-center gap-3 px-4 py-5">
                <Search className="text-text/40 h-5 w-5 shrink-0" />

                <div>
                  <p className="text-text text-sm font-medium">
                    Nenhuma categoria encontrada
                  </p>

                  <p className="text-text/50 text-xs">
                    Pressione Buscar para procurar empresas com esse termo.
                  </p>
                </div>
              </div>
            )}
          </div>,
          document.body,
        )}
    </motion.div>
  );
}
