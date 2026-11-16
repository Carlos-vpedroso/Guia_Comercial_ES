"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Clock3,
  Phone,
  Plus,
  Trash2,
  Star,
  Save,
  LoaderCircle,
  Search,
} from "lucide-react";

import { ApplicationContext } from "@/context/ApplicationContext";
import { useAuth } from "@/hook/useAuth";
import { useMask } from "@/hook/useMask";
import { AddressCompany, Company, CreateCompanyDTO } from "@/types/Company";
import { ContactType } from "@/types/Contact";
import { companyService } from "@/services/company.service";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

type ContactForm = {
  type: ContactType;
  url: string;
};

type DayHours = {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
};

type CompanyFormState = {
  name: string;
  description: string;
  categoryId: number;
  isHighlighted: boolean;
  isActive: boolean;
  address: AddressCompany;
  hours: DayHours[];
  contacts: ContactForm[];
  images: File[];
};

type Props = {
  initialCompany?: Company | null;
  onRedirect?: () => void;
};

const DAYS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const CONTACT_TYPES: {
  value: ContactType;
  label: string;
  placeholder: string;
}[] = [
  {
    value: "PHONE",
    label: "Telefone",
    placeholder: "(27) 3200-0000",
  },
  {
    value: "WHATSAPP",
    label: "WhatsApp",
    placeholder: "(27) 99999-9999",
  },
  {
    value: "EMAIL",
    label: "E-mail",
    placeholder: "contato@empresa.com.br",
  },
  {
    value: "WEBSITE",
    label: "Site",
    placeholder: "https://suaempresa.com.br",
  },
  {
    value: "INSTAGRAM",
    label: "Instagram",
    placeholder: "https://instagram.com/suaempresa",
  },
  {
    value: "FACEBOOK",
    label: "Facebook",
    placeholder: "https://facebook.com/suaempresa",
  },
  {
    value: "TIKTOK",
    label: "TikTok",
    placeholder: "https://tiktok.com/@suaempresa",
  },
];

const emptyAddress: AddressCompany = {
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
};

function normalizeContactUrl(url: string, type: ContactType): string {
  if (type === "PHONE") {
    return url.replace(/^tel:/i, "").replace(/^\+?55/, "");
  }

  if (type === "WHATSAPP") {
    if (url.includes("wa.me/")) {
      return url.split("wa.me/")[1].replace(/^55/, "");
    }

    return url.replace(/^tel:/i, "").replace(/^\+?55/, "");
  }

  if (type === "EMAIL") {
    return url.replace(/^mailto:/i, "");
  }

  return url;
}

function getInitialForm(company?: Company | null): CompanyFormState {
  const address = company?.address;

  return {
    name: company?.name ?? "",
    description: company?.description ?? "",
    categoryId: company?.categoryId ?? 0,
    isHighlighted: company?.isHighlighted ?? false,
    isActive: company?.isActive ?? true,

    address: {
      ...emptyAddress,
      ...(address ?? {}),
      zipCode: address?.zipCode ?? "",
    },

    hours: (company?.hours ?? [])
      .filter((day) => day.openTime || day.closeTime)
      .map((day) => ({
        dayOfWeek: day.dayOfWeek,
        openTime: day.openTime ?? "",
        closeTime: day.closeTime ?? "",
      }))
      .sort((a, b) => a.dayOfWeek - b.dayOfWeek),

    contacts: (company?.contacts ?? []).map((contact) => ({
      type: contact.type,
      url: normalizeContactUrl(contact.url, contact.type),
    })),

    images: [],
  };
}

export default function CriarEmpresaDashboard({
  initialCompany = null,
  onRedirect,
}: Props) {
  const { categories, setCompanies } = useAuth(ApplicationContext);
  const { phone } = useMask();

  const [form, setForm] = useState<CompanyFormState>(() =>
    getInitialForm(initialCompany),
  );
  const [existingImages, setExistingImages] = useState(
    initialCompany?.images ?? [],
  );

  const [deleteImageIds, setDeleteImageIds] = useState<string[]>([]);

  const [cepLoading, setCepLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cepMessage, setCepMessage] = useState("");

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageMessage, setImageMessage] = useState("");

  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const isEditing = Boolean(initialCompany?.id);
  const totalImages = existingImages.length + form.images.length;
  const availableImageSlots = Math.max(0, 5 - totalImages);

  useEffect(() => {
    setForm(getInitialForm(initialCompany));
    setExistingImages(initialCompany?.images ?? []);
    setDeleteImageIds([]);
    setCepMessage("");
    setImageMessage("");
  }, [initialCompany]);

  useEffect(() => {
    const previews = form.images.map((file) => URL.createObjectURL(file));

    setImagePreviews(previews);

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [form.images]);

  function updateField<K extends keyof CompanyFormState>(
    field: K,
    value: CompanyFormState[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateAddress<K extends keyof AddressCompany>(
    field: K,
    value: AddressCompany[K],
  ) {
    setForm((previous) => ({
      ...previous,
      address: {
        ...previous.address,
        [field]: value,
      },
    }));
  }

  function handleImagesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);

    // Permite selecionar novamente os mesmos arquivos.
    event.target.value = "";
    setImageMessage("");

    if (selectedFiles.length === 0) return;

    const availableSlots = Math.max(
      0,
      5 - existingImages.length - form.images.length,
    );

    if (availableSlots === 0) {
      setImageMessage(
        "O limite é de 5 imagens. Remova uma para adicionar outra.",
      );
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name}: arquivo não é uma imagem.`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name}: o tamanho máximo é 5 MB.`);
        continue;
      }

      validFiles.push(file);
    }

    const acceptedFiles = validFiles.slice(0, availableSlots);

    if (validFiles.length > availableSlots) {
      errors.push("O limite é de 5 imagens. Algumas não foram adicionadas.");
    }

    if (acceptedFiles.length > 0) {
      updateField("images", [...form.images, ...acceptedFiles]);
    }

    if (errors.length > 0) {
      setImageMessage(errors.join(" "));
    } else if (acceptedFiles.length > 0) {
      setImageMessage(
        `${acceptedFiles.length} imagem(ns) adicionada(s) com sucesso.`,
      );
    }
  }

  function removeImage(index: number) {
    updateField(
      "images",
      form.images.filter((_, currentIndex) => currentIndex !== index),
    );

    setImageMessage("");
  }

  function removeExistingImage(imageId: string) {
    setExistingImages((previous) =>
      previous.filter((image) => image.id !== imageId),
    );

    setDeleteImageIds((previous) =>
      previous.includes(imageId) ? previous : [...previous, imageId],
    );

    setImageMessage("");
  }

  function addHour() {
    const usedDays = form.hours.map((day) => day.dayOfWeek);

    const availableDay = DAYS.findIndex(
      (_, dayOfWeek) => !usedDays.includes(dayOfWeek),
    );

    if (availableDay === -1) return;

    updateField("hours", [
      ...form.hours,
      {
        dayOfWeek: availableDay,
        openTime: "",
        closeTime: "",
      },
    ]);
  }

  function removeHour(index: number) {
    updateField(
      "hours",
      form.hours.filter((_, currentIndex) => currentIndex !== index),
    );
  }

  function updateHours(
    index: number,
    field: "dayOfWeek" | "openTime" | "closeTime",
    value: string | number,
  ) {
    setForm((previous) => ({
      ...previous,
      hours: previous.hours.map((day, currentIndex) =>
        currentIndex === index
          ? {
              ...day,
              [field]: value,
            }
          : day,
      ),
    }));
  }

  function addContact() {
    const usedTypes = form.contacts.map((contact) => contact.type);

    const availableType = CONTACT_TYPES.find(
      (contact) => !usedTypes.includes(contact.value),
    );

    if (!availableType) return;

    updateField("contacts", [
      ...form.contacts,
      {
        type: availableType.value,
        url: "",
      },
    ]);
  }

  function updateContact(
    index: number,
    field: keyof ContactForm,
    value: string,
  ) {
    setForm((previous) => ({
      ...previous,
      contacts: previous.contacts.map((contact, currentIndex) =>
        currentIndex === index
          ? {
              ...contact,
              [field]: value,
            }
          : contact,
      ),
    }));
  }

  function removeContact(index: number) {
    updateField(
      "contacts",
      form.contacts.filter((_, currentIndex) => currentIndex !== index),
    );
  }

  async function handleCepChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);

    updateAddress("zipCode", digits);
    setCepMessage("");

    if (digits.length !== 8) return;

    setCepLoading(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);

      if (!response.ok) {
        throw new Error("Não foi possível consultar o CEP.");
      }

      const data = await response.json();

      if (data.erro) {
        setCepMessage("CEP não encontrado. Confira os números.");
        return;
      }

      setForm((previous) => ({
        ...previous,
        address: {
          ...previous.address,
          zipCode: digits,
          street: data.logradouro || previous.address.street,
          neighborhood: data.bairro || previous.address.neighborhood,
          city: data.localidade || previous.address.city,
          state: data.uf || previous.address.state,
        },
      }));

      setCepMessage(
        data.logradouro || data.localidade
          ? "Endereço preenchido pelo ViaCEP."
          : "CEP localizado. Complete o endereço manualmente.",
      );
    } catch {
      setCepMessage(
        "Não foi possível consultar o CEP. Preencha o endereço manualmente.",
      );
    } finally {
      setCepLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.categoryId || form.categoryId < 1) {
      toast.error("Selecione uma categoria para a empresa.");
      return;
    }

    if (
      form.hours.some((day) => Boolean(day.openTime) !== Boolean(day.closeTime))
    ) {
      toast.error("Informe a abertura e o fechamento ou deixe ambos vazios.");
      return;
    }

    if (
      form.hours.some(
        (day) => day.openTime && day.closeTime && day.openTime >= day.closeTime,
      )
    ) {
      toast.error(
        "O horário de fechamento deve ser posterior ao horário de abertura.",
      );
      return;
    }

    const contacts = form.contacts
      .filter((contact) => contact.url.trim() !== "")
      .map((contact) => ({
        type: contact.type,
        url:
          contact.type === "PHONE" || contact.type === "WHATSAPP"
            ? `55${contact.url.replace(/\D/g, "").replace(/^55/, "")}`
            : contact.url.trim(),
      }));

    const contactTypes = contacts.map((contact) => contact.type);

    if (new Set(contactTypes).size !== contactTypes.length) {
      toast.error("Cada tipo de contato pode ser cadastrado apenas uma vez.");
      return;
    }

    // Único payload enviado para o componente pai.
    const payload: CreateCompanyDTO = {
      data: {
        name: form.name.trim(),
        description: form.description.trim(),

        address: {
          ...form.address,
          street: form.address.street.trim(),
          number: form.address.number.trim(),
          complement: form.address.complement?.trim() ?? "",
          neighborhood: form.address.neighborhood.trim(),
          city: form.address.city.trim(),
          state: form.address.state.trim().toUpperCase(),
          zipCode: form.address.zipCode.replace(/\D/g, ""),
        },

        isHighlighted: form.isHighlighted,
        isActive: form.isActive,
        categoryId: form.categoryId,

        hours: Array.from({ length: 7 }, (_, dayOfWeek) => {
          const day = form.hours.find((hour) => hour.dayOfWeek === dayOfWeek);

          return {
            dayOfWeek,
            openTime: day?.openTime || null,
            closeTime: day?.closeTime || null,
          };
        }),

        contacts,
      },

      images: form.images,
      deleteImageIds,
    };

    setSaving(true);

    try {
      const result = isEditing
        ? await companyService.updateCompany(initialCompany!.slug, payload)
        : await companyService.createCompany(payload);

      if ("error" in result) {
        toast.error(result.error.message);
        return;
      }

      setCompanies((prev) =>
        isEditing
          ? prev.map((company) => (company.id === result.id ? result : company))
          : [...prev, result],
      );

      toast.success(
        isEditing
          ? "Empresa atualizada com sucesso!"
          : "Empresa cadastrada com sucesso!",
      );

      await new Promise((resolve) => setTimeout(resolve, 1500));
      onRedirect?.();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar a empresa.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initialCompany?.slug) {
      toast.error("Não foi possível identificar a empresa.");
      return;
    }

    setSaving(true);

    try {
      const result = await companyService.deleteCompany(initialCompany.slug);

      if (result && "error" in result) {
        toast.error(result.error.message);
        return;
      }

      setDeleteModal(false);

      setCompanies((prev) =>
        prev.filter((company) => company.id !== initialCompany.id),
      );

      toast.success("Empresa excluída com sucesso!");

      await new Promise((resolve) => setTimeout(resolve, 1500));

      onRedirect?.();
    } catch (error) {
      console.error("Erro ao excluir empresa:", error);
      toast.error("Não foi possível excluir a empresa.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "border-marca1/50 text-fundo2 placeholder:text-fundo2/40 focus:border-marca focus:ring-marca/15 w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const labelClass = "text-fundo2 mb-1.5 block text-sm font-semibold";

  return (
    <section className="bg-fundo min-h-screen min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Cabeçalho */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onRedirect}
            className="bg-card text-text hover:text-text2 hover:bg-marca rounded-xl border p-3 transition"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="font-title text-fundo2 text-3xl font-bold sm:text-4xl">
              {isEditing ? "Editar empresa" : "Cadastrar empresa"}
            </h1>

            <p className="text-fundo2/65 mt-1 text-sm sm:text-base">
              {isEditing
                ? "Atualize as informações da empresa cadastrada."
                : "Preencha as informações para adicionar uma empresa ao guia."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados básicos */}
          <section className="bg-card border-border rounded-2xl border p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-marca1/20 text-marca rounded-xl p-3">
                <Building2 size={22} />
              </div>

              <div>
                <h2 className="font-title text-fundo2 text-xl font-bold">
                  Dados da empresa
                </h2>
                <p className="text-fundo2/60 text-sm">
                  Informações principais e categoria.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelClass} htmlFor="company-name">
                  Nome da empresa *
                </label>

                <input
                  id="company-name"
                  className={inputClass}
                  disabled={isEditing}
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Ex.: Pousada Viagem"
                  minLength={2}
                  maxLength={100}
                  required
                />

                <p className="text-fundo2/45 mt-1 text-xs">
                  {form.name.length}/100 caracteres
                </p>
              </div>

              <div>
                <label className={labelClass} htmlFor="company-description">
                  Descrição *
                </label>

                <textarea
                  id="company-description"
                  className={`${inputClass} min-h-32 resize-y`}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Conte um pouco sobre a empresa, seus produtos e serviços..."
                  maxLength={1000}
                  required
                />

                <p className="text-fundo2/45 mt-1 text-xs">
                  {form.description.length}/1000 caracteres
                </p>
              </div>

              <div>
                <label className={labelClass} htmlFor="company-category">
                  Categoria *
                </label>

                <select
                  id="company-category"
                  className={inputClass}
                  value={form.categoryId || ""}
                  onChange={(event) =>
                    updateField("categoryId", Number(event.target.value) || 0)
                  }
                  required
                >
                  <option value="">Selecione uma categoria</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-marca1/30 bg-fundo flex items-center justify-between gap-4 rounded-xl border p-4">
                <div className="flex items-start gap-3">
                  <Star size={18} className="text-marca mt-0.5" />

                  <div>
                    <p className="text-fundo2 text-sm font-semibold">
                      Colocar empresa em destaque
                    </p>

                    <p className="text-fundo2/60 mt-1 text-xs">
                      A empresa poderá receber maior visibilidade no guia.
                    </p>
                  </div>
                </div>

                <Switch
                  checked={form.isHighlighted}
                  onCheckedChange={(checked) =>
                    updateField("isHighlighted", checked)
                  }
                  aria-label="Colocar empresa em destaque"
                  className="cursor-pointer"
                />
              </div>
              {isEditing && (
                <div className="border-marca1/30 bg-fundo flex items-center justify-between gap-4 rounded-xl border p-4">
                  <div className="flex items-start gap-3">
                    <Building2 size={18} className="text-marca mt-0.5" />

                    <div>
                      <p className="text-fundo2 text-sm font-semibold">
                        Empresa ativa
                      </p>

                      <p className="text-fundo2/60 mt-1 text-xs">
                        {form.isActive
                          ? "A empresa está ativa e pode aparecer no guia."
                          : "A empresa está inativa e não deve aparecer publicamente."}
                      </p>
                    </div>
                  </div>

                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(checked) =>
                      updateField("isActive", checked)
                    }
                    aria-label="Ativar ou inativar empresa"
                    className="cursor-pointer"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Endereço */}
          <section className="border-border bg-card rounded-2xl border p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-marca1/20 text-marca rounded-xl p-3">
                <MapPin size={22} />
              </div>

              <div>
                <h2 className="font-title text-fundo2 text-xl font-bold">
                  Endereço
                </h2>
                <p className="text-fundo2/60 text-sm">
                  Digite o CEP para preencher os dados automaticamente.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="company-cep">
                  CEP
                </label>

                <div className="relative">
                  <input
                    id="company-cep"
                    className={`${inputClass} pr-11`}
                    value={form.address.zipCode}
                    onChange={(event) => handleCepChange(event.target.value)}
                    placeholder="00000-000"
                    inputMode="numeric"
                    maxLength={9}
                  />

                  {cepLoading ? (
                    <LoaderCircle
                      size={18}
                      className="text-marca absolute top-1/2 right-3 -translate-y-1/2 animate-spin"
                    />
                  ) : (
                    <Search
                      size={18}
                      className="text-fundo2/40 absolute top-1/2 right-3 -translate-y-1/2"
                    />
                  )}
                </div>

                {cepMessage && (
                  <p role="status" className="text-fundo2/65 mt-2 text-xs">
                    {cepMessage}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="company-state">
                  Estado (UF) *
                </label>

                <input
                  id="company-state"
                  className={inputClass}
                  value={form.address.state}
                  onChange={(event) =>
                    updateAddress(
                      "state",
                      event.target.value.toUpperCase().slice(0, 2),
                    )
                  }
                  placeholder="ES"
                  maxLength={2}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="company-street">
                  Rua / Logradouro *
                </label>

                <input
                  id="company-street"
                  className={inputClass}
                  value={form.address.street}
                  onChange={(event) =>
                    updateAddress("street", event.target.value)
                  }
                  placeholder="Nome da rua ou avenida"
                  maxLength={120}
                  required
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="company-number">
                  Número
                </label>

                <input
                  id="company-number"
                  className={inputClass}
                  value={form.address.number}
                  onChange={(event) =>
                    updateAddress("number", event.target.value)
                  }
                  placeholder="Ex.: 123"
                  maxLength={10}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="company-complement">
                  Complemento
                </label>

                <input
                  id="company-complement"
                  className={inputClass}
                  value={form.address.complement}
                  onChange={(event) =>
                    updateAddress("complement", event.target.value)
                  }
                  placeholder="Sala, bloco, loja..."
                  maxLength={60}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="company-neighborhood">
                  Bairro *
                </label>

                <input
                  id="company-neighborhood"
                  className={inputClass}
                  value={form.address.neighborhood}
                  onChange={(event) =>
                    updateAddress("neighborhood", event.target.value)
                  }
                  placeholder="Nome do bairro"
                  maxLength={80}
                  required
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="company-city">
                  Cidade *
                </label>

                <input
                  id="company-city"
                  className={inputClass}
                  value={form.address.city}
                  onChange={(event) =>
                    updateAddress("city", event.target.value)
                  }
                  placeholder="Nome da cidade"
                  maxLength={80}
                  required
                />
              </div>
            </div>
          </section>

          {/* Horários */}
          <section className="border-border bg-card rounded-2xl border p-5 sm:p-7">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-marca1/20 text-marca rounded-xl p-3">
                  <Clock3 size={22} />
                </div>

                <div>
                  <h2 className="font-title text-fundo2 text-xl font-bold">
                    Horários de funcionamento
                  </h2>
                  <p className="text-fundo2/60 text-sm">
                    Adicione os dias e os respectivos horários de funcionamento.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addHour}
                disabled={form.hours.length >= DAYS.length}
                className="bg-marca text-text2 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={17} />
                Adicionar horário
              </button>
            </div>

            {form.hours.length === 0 ? (
              <div className="border-marca1/30 rounded-xl border border-dashed p-6 text-center">
                <Clock3 size={24} className="text-marca mx-auto mb-2" />

                <p className="text-fundo2 text-sm font-medium">
                  Nenhum horário adicionado
                </p>

                <p className="text-fundo2/60 mt-1 text-xs">
                  Clique em “Adicionar horário” para cadastrar os dias de
                  funcionamento.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {form.hours.map((day, index) => {
                  const usedByOtherDays = form.hours
                    .filter((_, currentIndex) => currentIndex !== index)
                    .map((item) => item.dayOfWeek);

                  return (
                    <div
                      key={`${day.dayOfWeek}-${index}`}
                      className="border-border bg-card rounded-xl border p-4"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span className="text-fundo2 text-sm font-semibold">
                          Horário {index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeHour(index)}
                          className="text-fundo2/60 hover:bg-marca1/20 hover:text-fundo2 rounded-lg p-2 transition"
                          aria-label={`Remover horário ${index + 1}`}
                          title="Remover horário"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-3">
                        <div>
                          <label
                            className={labelClass}
                            htmlFor={`day-${index}`}
                          >
                            Dia da semana
                          </label>

                          <select
                            id={`day-${index}`}
                            value={day.dayOfWeek}
                            onChange={(event) =>
                              updateHours(
                                index,
                                "dayOfWeek",
                                Number(event.target.value),
                              )
                            }
                            className={inputClass}
                          >
                            {DAYS.map((name, dayOfWeek) => (
                              <option
                                key={dayOfWeek}
                                value={dayOfWeek}
                                disabled={
                                  dayOfWeek !== day.dayOfWeek &&
                                  usedByOtherDays.includes(dayOfWeek)
                                }
                              >
                                {name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            className={labelClass}
                            htmlFor={`open-${index}`}
                          >
                            Abertura
                          </label>

                          <input
                            id={`open-${index}`}
                            type="time"
                            value={day.openTime}
                            onChange={(event) =>
                              updateHours(index, "openTime", event.target.value)
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label
                            className={labelClass}
                            htmlFor={`close-${index}`}
                          >
                            Fechamento
                          </label>

                          <input
                            id={`close-${index}`}
                            type="time"
                            value={day.closeTime}
                            onChange={(event) =>
                              updateHours(
                                index,
                                "closeTime",
                                event.target.value,
                              )
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <p className="text-fundo2/55 mt-3 text-xs">
                        Deixe abertura e fechamento vazios se ainda não quiser
                        definir o horário deste dia.
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Contatos */}
          <section className="border-border bg-card rounded-2xl border p-5 sm:p-7">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-marca1/20 text-marca rounded-xl p-3">
                  <Phone size={22} />
                </div>

                <div>
                  <h2 className="font-title text-fundo2 text-xl font-bold">
                    Contatos
                  </h2>
                  <p className="text-fundo2/60 text-sm">
                    Adicione telefone, WhatsApp, e-mail e redes sociais.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addContact}
                disabled={form.contacts.length >= CONTACT_TYPES.length}
                className="bg-marca text-text2 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={17} />
                Adicionar
              </button>
            </div>

            {form.contacts.length === 0 ? (
              <div className="border-marca1/30 rounded-xl border border-dashed p-6 text-center">
                <Phone size={24} className="text-marca mx-auto mb-2" />

                <p className="text-fundo2 text-sm font-medium">
                  Nenhum contato adicionado
                </p>

                <p className="text-fundo2/60 mt-1 text-xs">
                  Os contatos são opcionais.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {form.contacts.map((contact, index) => {
                  const selectedType = CONTACT_TYPES.find(
                    (item) => item.value === contact.type,
                  );

                  return (
                    <div
                      key={`${contact.type}-${index}`}
                      className="border-border bg-card rounded-xl border p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="text-fundo2 text-sm font-semibold">
                          Contato {index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeContact(index)}
                          className="text-fundo2/60 hover:bg-marca1/20 hover:text-fundo2 rounded-lg p-2 transition"
                          aria-label="Remover contato"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[0.8fr_1.2fr]">
                        <div>
                          <label
                            className={labelClass}
                            htmlFor={`contact-type-${index}`}
                          >
                            Tipo
                          </label>

                          <select
                            id={`contact-type-${index}`}
                            value={contact.type}
                            onChange={(event) =>
                              updateContact(index, "type", event.target.value)
                            }
                            className={inputClass}
                          >
                            {CONTACT_TYPES.map((type) => {
                              const usedByOther = form.contacts.some(
                                (item, itemIndex) =>
                                  itemIndex !== index &&
                                  item.type === type.value,
                              );

                              return (
                                <option
                                  key={type.value}
                                  value={type.value}
                                  disabled={usedByOther}
                                >
                                  {type.label}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div>
                          <label
                            className={labelClass}
                            htmlFor={`contact-url-${index}`}
                          >
                            {selectedType?.label ?? "Contato"}
                          </label>

                          <input
                            id={`contact-url-${index}`}
                            className={inputClass}
                            value={contact.url}
                            onChange={(event) => {
                              const value = event.target.value;

                              const formattedValue =
                                contact.type === "PHONE" ||
                                contact.type === "WHATSAPP"
                                  ? phone(value)
                                  : value;

                              updateContact(index, "url", formattedValue);
                            }}
                            placeholder={selectedType?.placeholder}
                            inputMode={
                              contact.type === "PHONE" ||
                              contact.type === "WHATSAPP"
                                ? "numeric"
                                : "text"
                            }
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="text-fundo2/55 mt-4 text-xs">
              Preencha apenas os contatos que deseja exibir publicamente.
              Telefone, WhatsApp, e-mail e links serão validados pela API.
            </p>
          </section>

          {/* Imagens */}
          <section className="border-border bg-card rounded-2xl border p-5 sm:p-7">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-marca1/20 text-marca rounded-xl p-3">
                  <Building2 size={22} />
                </div>

                <div>
                  <h2 className="font-title text-fundo2 text-xl font-bold">
                    Imagens da empresa
                  </h2>
                  <p className="text-fundo2/60 text-sm">
                    Gerencie as fotos cadastradas e adicione novas imagens.
                  </p>
                </div>
              </div>

              <span className="bg-marca1/20 text-fundo2 rounded-full px-3 py-1.5 text-xs font-semibold">
                {totalImages}/5 imagens
              </span>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {/* Imagens já cadastradas */}
                {existingImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`border-border bg-card group relative overflow-hidden rounded-2xl border ${
                      index === 0 && form.images.length === 0
                        ? "col-span-2 lg:col-span-4"
                        : ""
                    }`}
                  >
                    <div
                      className={`bg-fundo relative ${
                        index === 0 && form.images.length === 0
                          ? "aspect-[2/1]"
                          : "aspect-square"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.url}
                        alt={`Imagem cadastrada ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      {index === 0 && form.images.length === 0 && (
                        <div className="bg-card text-marca1 absolute top-3 left-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold shadow-md">
                          <Star size={14} fill="currentColor" />
                          Foto principal
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => removeExistingImage(image.id)}
                        aria-label={`Excluir imagem cadastrada ${index + 1}`}
                        title="Excluir imagem"
                        className="bg-card text-fundo2 absolute top-3 right-3 rounded-lg p-2 shadow transition hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="p-3">
                      <p className="text-fundo2 text-xs font-medium">
                        Imagem cadastrada
                      </p>
                      <p className="text-fundo2/50 mt-1 text-xs">
                        Já salva no servidor
                      </p>
                    </div>
                  </div>
                ))}

                {/* Novas imagens selecionadas */}
                {form.images.map((file, index) => (
                  <div
                    key={`${file.name}-${file.lastModified}-${index}`}
                    className="border-border bg-card group relative overflow-hidden rounded-2xl border"
                  >
                    <div className="bg-fundo relative aspect-square">
                      {imagePreviews[index] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imagePreviews[index]}
                          alt={file.name}
                          className="h-full w-full object-cover"
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label={`Remover nova imagem ${index + 1}`}
                        title="Remover imagem"
                        className="bg-card text-fundo2 absolute top-3 right-3 rounded-lg p-2 shadow transition hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="p-3">
                      <p
                        className="text-fundo2 truncate text-xs font-medium"
                        title={file.name}
                      >
                        {file.name}
                      </p>
                      <p className="text-fundo2/50 mt-1 text-xs">
                        Nova imagem · {(file.size / (1024 * 1024)).toFixed(2)}{" "}
                        MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botão para adicionar imagens */}
              {availableImageSlots > 0 && (
                <label
                  htmlFor="company-images"
                  className="border-marca1/40 hover:border-marca hover:bg-marca1/10 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition"
                >
                  <div className="bg-marca1/20 text-marca mb-3 rounded-full p-3">
                    <Plus size={24} />
                  </div>

                  <span className="text-fundo2 text-sm font-semibold">
                    Adicionar imagens
                  </span>

                  <span className="text-fundo2/60 mt-1 text-xs">
                    Clique para selecionar novas fotos · Até 5 MB por arquivo
                  </span>

                  <span className="text-fundo2/50 mt-1 text-xs">
                    {5 - existingImages.length - form.images.length} vaga(s)
                    disponível(is)
                  </span>

                  <input
                    id="company-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                    className="sr-only"
                  />
                </label>
              )}

              {imageMessage && (
                <p role="status" className="text-fundo2/70 text-sm">
                  {imageMessage}
                </p>
              )}

              <p className="text-fundo2/55 text-xs">
                As exclusões e novas imagens serão aplicadas quando você salvar
                as alterações.
              </p>
            </div>
          </section>

          {/* Ações */}
          <div className="border-marca1/30 bg-card sticky bottom-3 flex flex-col-reverse items-center gap-4 rounded-2xl border p-4 shadow-lg lg:flex-row">
            {isEditing && (
              <div>
                <button
                  type="button"
                  onClick={() => setDeleteModal(true)}
                  disabled={saving}
                  className="bg-marca text-text2 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Excluir Empresa
                </button>
              </div>
            )}

            <div className="flex flex-1 flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={onRedirect}
                disabled={saving}
                className="border-marca1/40 text-fundo2 hover:bg-marca1/15 rounded-xl border px-5 py-3 text-sm font-semibold transition disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving || cepLoading}
                className="bg-marca2 text-text2 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}

                {saving
                  ? "Salvando..."
                  : isEditing
                    ? "Salvar alterações"
                    : "Cadastrar empresa"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <AlertDialog
        open={deleteModal}
        onOpenChange={(open) => {
          if (!saving) {
            setDeleteModal(open);
          }
        }}
      >
        <AlertDialogContent className="border-marca1/30 bg-card rounded-2xl">
          <AlertDialogHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <Trash2 size={24} />
            </div>

            <AlertDialogTitle className="font-title text-fundo2 text-xl">
              Excluir empresa?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-fundo2/70 text-sm leading-relaxed">
              Você está prestes a excluir a empresa{" "}
              <strong className="text-fundo2">{initialCompany?.name}</strong>.
              Essa ação não poderá ser desfeita e a empresa será removida do
              guia.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4 gap-2 sm:gap-2">
            <AlertDialogCancel
              disabled={saving}
              className="border-marca1/40 text-fundo2 hover:bg-marca1/15 rounded-xl"
            >
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={saving}
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
              className="rounded-xl bg-red-600 text-white hover:bg-red-700"
            >
              {saving ? (
                <>
                  <LoaderCircle size={16} className="mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 size={16} className="mr-2" />
                  Sim, excluir empresa
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
