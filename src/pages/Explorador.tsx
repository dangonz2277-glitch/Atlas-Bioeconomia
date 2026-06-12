import { useState, useEffect, useRef, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  CircleMarker,
  Tooltip,
  Popup,
  useMap,
  ScaleControl
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import {
  Maximize2,
  ChevronLeft,
  Layers,
  Info,
  ChevronRight,
  Map as MapIcon,
  X,
  Navigation,
  ChevronDown,
  Users,
  AlertCircle,
  ArrowRight,
  Loader2,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { cn } from "@/src/lib/utils";

// --- DATA FROM MD ---
type RegionKey = "Amazonía" | "Santa Cruz" | "Altiplano";

const bioeconomyData: Record<string, { titulo: string; metricas: { valor: string; etiqueta: string }[]; descripcion: string }> = {
  "amazonia_bosques": {
    "titulo": "Bosques Amazónicos Bolivianos",
    "metricas": [
      { "valor": "7", "etiqueta": "Tipos de bosque" },
      { "valor": "5", "etiqueta": "Áreas nacionales" },
      { "valor": "12", "etiqueta": "Áreas municipales" },
      { "valor": "23", "etiqueta": "Municipios cubiertos" }
    ],
    "descripcion": "La Amazonia boliviana concentra la mayor continuidad de cobertura vegetal y densidad de biomasa del país, con siete tipos de bosque que incluyen formaciones húmedas siempreverdes, preandinas e inundables. Catalogada como hotspot global de biodiversidad, es clave para la regulación del ciclo hídrico nacional y el sustento de economías locales basadas en productos forestales no maderables."
  },
  "amazonia_areas_potenciales": {
    "titulo": "Zonas Potenciales Asaí",
    "metricas": [
      { "valor": "4", "etiqueta": "Hábitats aptos" },
      { "valor": "5", "etiqueta": "Parques nacionales" },
      { "valor": "Alto", "etiqueta": "Potencial silvestre" }
    ],
    "descripcion": "Los bosques húmedos siempreverdes y de llanuras inundables de la Amazonia boliviana constituyen el hábitat natural del asaí (Euterpe precatoria), con alto potencial de aprovechamiento biocomercial sostenible. Las zonas amortiguadoras de áreas como Madidi y Pilón Lajas presentan condiciones óptimas para su manejo y cosecha no maderable."
  },
  "amazonia_comunidades": {
    "titulo": "Comunidades del Asaí",
    "metricas": [
      { "valor": "23", "etiqueta": "Municipios vinculados" },
      { "valor": "12", "etiqueta": "Áreas municipales" },
      { "valor": "3", "etiqueta": "Cuencas principales" }
    ],
    "descripcion": "Las comunidades amazónicas articuladas al manejo del asaí operan en territorios que coinciden con áreas de conservación municipal como Bajo Madidi, Rhukanrhuka y la Reserva Espíritu. Su rol como custodias del bosque las posiciona como actores estratégicos en cadenas de valor bioeconómicas de alcance nacional e internacional."
  },
  "altiplano_bosques": {
    "titulo": "Bosques Altoandinos Nativos",
    "metricas": [
      { "valor": "3", "etiqueta": "Tipos de bosque" },
      { "valor": "9", "etiqueta": "Áreas departamentales" },
      { "valor": "46", "etiqueta": "Áreas municipales" }
    ],
    "descripcion": "El altiplano boliviano alberga formaciones forestales especializadas —bosques de Polylepis o Kewiñal, bosques secos interandinos y matorrales de tolar— adaptadas a condiciones extremas de helada y aridez. Estos relictos boscosos regulan la hidrología de cuencas cerradas y actúan como refugios irremplazables de biodiversidad altoandina."
  },
  "altiplano_produccion": {
    "titulo": "Producción Quinua Real",
    "metricas": [
      { "valor": "98", "etiqueta": "Municipios productores" },
      { "valor": "3", "etiqueta": "Áreas nacionales" },
      { "valor": "Alto", "etiqueta": "Valor exportación" }
    ],
    "descripcion": "La cuenca endorreica del altiplano boliviano es el escenario natural de la Quinua Real, cultivo ancestral con alta demanda en mercados internacionales. Su producción depende directamente de la red hídrica de cabecera de cuenca y del régimen de deshielo glaciar, factores que determinan su resiliencia y calidad nutritiva excepcional."
  },
  "altiplano_comunidades": {
    "titulo": "Comunidades de la Quinua",
    "metricas": [
      { "valor": "98", "etiqueta": "Municipios vinculados" },
      { "valor": "46", "etiqueta": "Áreas municipales" },
      { "valor": "9", "etiqueta": "Áreas departamentales" }
    ],
    "descripcion": "Las comunidades del altiplano son las principales custodias del conocimiento tradicional asociado al cultivo de la quinua y a la gestión de los ecosistemas altoandinos. Su articulación con áreas protegidas municipales y departamentales fortalece la gobernanza territorial y la sostenibilidad de una cadena de valor bioeconómica con proyección global."
  },
  "amazonia_rios": {
    "titulo": "Red Hidrográfica Amazónica",
    "metricas": [
      { "valor": "Macrocuenca", "etiqueta": "Amazonas" },
      { "valor": "Conectividad", "etiqueta": "Fluvial" }
    ],
    "descripcion": "Red de drenaje de gran caudal que actúa como el principal sistema de transporte regional y soporte biológico de las tierras bajas."
  },
  "sc_rios": {
    "titulo": "Red Hidrográfica Amazónica",
    "metricas": [
      { "valor": "Macrocuenca", "etiqueta": "Amazonas" },
      { "valor": "Conectividad", "etiqueta": "Fluvial" }
    ],
    "descripcion": "Red de drenaje de gran caudal que actúa como el principal sistema de transporte regional y soporte biológico de las tierras bajas."
  },
  "altiplano_rios": {
    "titulo": "Cuenca Endorreica",
    "metricas": [
      { "valor": "Régimen", "etiqueta": "Deshielos" },
      { "valor": "Dependencia", "etiqueta": "Estacional" }
    ],
    "descripcion": "Red hídrica vital estructurada en torno a valles de cabecera, esencial para los sistemas de vida y riego agrícola de altura."
  }
};

interface MapLayer {
  id: string;
  category: string;
  catalogProductId?: string;
  name: string;
  productName: string;
  scientificName?: string;
  badge: string;
  color: string;
  stats: { label: string; value: string }[];
  technicalInfo: {
    context: string;
    social: string;
    challenges: string[];
  };
  gallery: { url: string; description: string }[];
  geometryType: 'polygon' | 'points';
  geojsonUrl: string;
  styleUrl?: string;
  defaultStyle?: {
    fillColor?: string;
    color?: string;
    weight?: number;
    fillOpacity?: number;
    dashArray?: string;
  };
}

interface MacroRegion {
  name: string;
  center: [number, number];
  zoom: number;
  layers: MapLayer[];
}

const macroRegions: Record<RegionKey, MacroRegion> = {
  "Amazonía": {
    name: "Amazonía",
    center: [-12.5, -67.0],
    zoom: 7,
    layers: [
      {
        id: "amazon-bosques",
        category: "Conservación y Cobertura",
        name: "Bosques",
        productName: "Bosques Amazonía",
        badge: "Conservación",
        color: "#2E8B57",
        stats: [],
        technicalInfo: {
          context: "Cobertura boscosa de la región amazónica. Fundamental para la regulación climática.",
          social: "Manejo forestal comunitario e integral.",
          challenges: ["Deforestación", "Incendios forestales"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/BOSQUES_AMAZONIA_2024_simplified.geojson",
        styleUrl: "/maps/mapStyles/BOSQUES_AMAZONIA_2024.json"
      },
      {
        id: "amazon-asai",
        category: "Sistemas Productivos",
        catalogProductId: "asai",
        name: "Áreas Potenciales Asaí",
        productName: "Asaí",
        scientificName: "Euterpe precatoria",
        badge: "Aprovechamiento No Consuntivo",
        color: "#7B68EE",
        stats: [
          { label: "Municipios Productores", value: "24" },
          { label: "Área de Intervención", value: "216.950 km²" },
          { label: "Participación Femenina", value: "90%" },
          { label: "Modelado", value: "MaxEnt" }
        ],
        technicalInfo: {
          context: "El asaí es un fruto amazónico con alto valor nutricional. La Amazonía boliviana es clave para la regulación climática y la conservación.",
          social: "Participación activa de comunidades indígenas y territorios TIOC en la recolección silvestre.",
          challenges: ["Logística de transporte", "Impacto de la variabilidad climática", "Presión por deforestación"]
        },
        gallery: [
          { url: "/images/azai/asai1.jpg", description: "Recolección tradicional de frutos en el dosel amazónico." },
          { url: "/images/azai/asai2.jpg", description: "Centros de acopio locales gestionados por comunidades." },
          { url: "/images/azai/asai3.jpg", description: "Procesamiento artesanal del Asaí con alta participación." }
        ],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/ASAI_AREAS_POTENCIALES_AMAZONIA.geojson",
        styleUrl: "/maps/mapStyles/ASAI_AREAS_POTENCIALES_AMAZONIA.json"
      },
      {
        id: "amazon-comunidades",
        category: "Sistemas Productivos",
        name: "Comunidades",
        productName: "Gobernanza Indígena",
        badge: "Custodios del Bosque",
        color: "#D4AF37",
        stats: [
          { label: "Territorios Reconocidos", value: "18 TIOCs" },
          { label: "Población Indígena", value: "156.000" }
        ],
        technicalInfo: {
          context: "Las TIOCs representan la base de la gobernanza territorial indígena, asegurando la gestión ancestral del bosque.",
          social: "Organizaciones comunitarias que gestionan los conocimientos tradicionales.",
          challenges: ["Invasión de tierras", "Falta de reconocimiento oficial", "Impacto de industrias extractivas"]
        },
        gallery: [
          { url: "/images/azai/asai3.jpg", description: "Reuniones comunitarias para la gestión del bosque." },
          { url: "/images/azai/asai4.jpg", description: "Líderes indígenas monitoreando la salud del ecosistema fluvial." }
        ],
        geometryType: 'points',
        geojsonUrl: "/maps/geojson/COMUNIDADES_AMAZONIA_2024.geojson"
      },
      {
        id: "amazon-rios_principales",
        category: "Recursos Hídricos",
        name: "Ríos Principales",
        productName: "Ríos Principales",
        badge: "Hidrología",
        color: "#1E90FF",
        stats: [],
        technicalInfo: {
          context: "Red de drenaje de gran caudal que actúa como el principal sistema de transporte regional.",
          social: "Conectividad fluvial para comunidades locales.",
          challenges: ["Contaminación", "Alteración del ciclo hidrológico"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/RIOS_PRIN_AMAZONIA_2003_simplified.geojson",
        styleUrl: "/maps/mapStyles/RIOS_PRIN_AMAZONIA.json"
      },
      {
        id: "amazon-rios_secundarios",
        category: "Recursos Hídricos",
        name: "Ríos Secundarios",
        productName: "Ríos Secundarios",
        badge: "Hidrología",
        color: "#1E90FF",
        stats: [],
        technicalInfo: {
          context: "Red de drenaje complementaria que tributa a los cauces principales amazónicos.",
          social: "Conectividad fluvial para comunidades locales.",
          challenges: ["Contaminación", "Alteración del ciclo hidrológico"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/RIOS_SEC_AMAZONIA_2003_simplified.geojson",
        styleUrl: "/maps/mapStyles/RIOS_PRIN_AMAZONIA.json"
      },
      {
        id: "amazon-ap_nacional",
        category: "Conservación y Cobertura",
        name: "Áreas Protegidas Nacionales",
        productName: "AP Nacional",
        badge: "Conservación",
        color: "#1B5E20",
        stats: [],
        technicalInfo: {
          context: "Áreas protegidas nacionales de la Amazonía.",
          social: "Conservación de biodiversidad y territorios.",
          challenges: ["Deforestación", "Asentamientos irregulares"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/AP_NACIONAL_AMAZONIA.geojson",
        defaultStyle: { fillColor: '#1B5E20', color: '#004D40', weight: 2, fillOpacity: 0.6 }
      },
      {
        id: "amazon-ap_departamental",
        category: "Conservación y Cobertura",
        name: "Áreas Protegidas Departamentales",
        productName: "AP Departamental",
        badge: "Conservación",
        color: "#2E8B57",
        stats: [],
        technicalInfo: {
          context: "Áreas protegidas departamentales de la Amazonía.",
          social: "Conservación de biodiversidad y territorios.",
          challenges: ["Deforestación", "Asentamientos irregulares"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/AP_DEPARTAMENTAL_AMAZONIA.geojson",
        defaultStyle: { fillColor: '#2E8B57', color: '#1B5E20', weight: 2, fillOpacity: 0.6 }
      },
      {
        id: "amazon-ap_municipal",
        category: "Conservación y Cobertura",
        name: "Áreas Protegidas Municipales",
        productName: "AP Municipal",
        badge: "Conservación",
        color: "#90EE90",
        stats: [],
        technicalInfo: {
          context: "Áreas protegidas municipales de la Amazonía.",
          social: "Conservación de biodiversidad y territorios.",
          challenges: ["Deforestación", "Asentamientos irregulares"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/AP_MUNICIPAL_AMAZONIA.geojson",
        defaultStyle: { fillColor: '#90EE90', color: '#2E8B57', weight: 2, fillOpacity: 0.5, dashArray: '4, 4' }
      },
      {
        id: "amazon-sitios_ramsar",
        category: "Recursos Hídricos",
        name: "Sitios Ramsar",
        productName: "Sitios Ramsar",
        badge: "Humedales",
        color: "#1f78b4",
        stats: [],
        technicalInfo: {
          context: "Humedales de importancia internacional para la regulación hídrica.",
          social: "Conservación de biodiversidad acuática.",
          challenges: ["Contaminación", "Cambio climático"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/SITIOS_RAMSAR_2018_AMAZONIA.geojson",
        styleUrl: "/maps/mapStyles/SITIOS_RAMSAR_AMAZONIA.json"
      },
      {
        id: "amazon-cuencas",
        category: "Recursos Hídricos",
        name: "Cuencas Hidrográficas",
        productName: "Cuencas Hidrográficas",
        badge: "Hidrología",
        color: "#1f78b4",
        stats: [],
        technicalInfo: {
          context: "Cuencas Hidrográficas de Nivel 2.",
          social: "N/A",
          challenges: []
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/CUENCAS_N2_2014_AMAZONIA.geojson",
        styleUrl: "/maps/mapStyles/CUENCAS_N2_AMAZONIA.json"
      }
    ]
  },
  "Santa Cruz": {
    name: "Santa Cruz (Municipio de San Ignacio)",
    center: [-17.0, -60.0],
    zoom: 7,
    layers: [
      {
        id: "sc-bosques",
        category: "Conservación y Cobertura",
        name: "Bosques",
        productName: "Bosques Santa Cruz",
        badge: "Conservación",
        color: "#2E8B57",
        stats: [],
        technicalInfo: {
          context: "Cobertura boscosa de la región de Santa Cruz. Ecosistemas de transición y Chiquitania.",
          social: "Manejo forestal certificado y comunitario.",
          challenges: ["Avance de la frontera agrícola", "Incendios forestales recurrentes"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/BOSQUES_SANTA_CRUZ_2024_simplified.geojson",
        styleUrl: "/maps/mapStyles/BOSQUES_SANTA_CRUZ_2024.json"
      },
      {
        id: "sc-asai",
        category: "Sistemas Productivos",
        name: "Áreas Potenciales Asaí",
        productName: "Asaí (Chiquitano)",
        badge: "Aprovechamiento",
        color: "#7B68EE",
        stats: [],
        technicalInfo: {
          context: "Zonas con potencial para recolección de asaí y otros frutos del bosque en Santa Cruz.",
          social: "Integración de comunidades chiquitanas a cadenas de valor sostenibles.",
          challenges: ["Estrés hídrico", "Infraestructura de acopio"]
        },
        gallery: [
          { url: "/images/azai/asai1.jpg", description: "Recolección tradicional de frutos en el dosel amazónico." },
          { url: "/images/azai/asai2.jpg", description: "Centros de acopio locales gestionados por comunidades." },
          { url: "/images/azai/asai3.jpg", description: "Procesamiento artesanal del Asaí con alta participación." }
        ],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/ASAI_AREAS_POTENCIALES_SANTA_CRUZ.geojson",
        styleUrl: "/maps/mapStyles/ASAI_AREAS_POTENCIALES_SANTA_CRUZ.json"
      },
      {
        id: "sc-comunidades",
        category: "Sistemas Productivos",
        name: "Comunidades",
        productName: "Comunidades Locales",
        badge: "Gobernanza",
        color: "#D4AF37",
        stats: [],
        technicalInfo: {
          context: "Asentamientos y comunidades involucradas en la bioeconomía cruceña.",
          social: "Organizaciones de base y productivas.",
          challenges: ["Acceso a mercados", "Servicios básicos"]
        },
        gallery: [],
        geometryType: 'points',
        geojsonUrl: "/maps/geojson/COMUNIDADES_SANTA_CRUZ_2024.geojson"
      },
      {
        id: "sc-rios_principales",
        category: "Recursos Hídricos",
        name: "Ríos Principales",
        productName: "Ríos Principales",
        badge: "Hidrología",
        color: "#1E90FF",
        stats: [],
        technicalInfo: {
          context: "Red de drenaje de gran caudal que actúa como el principal sistema de transporte regional.",
          social: "Conectividad fluvial para comunidades locales.",
          challenges: ["Contaminación", "Alteración del ciclo hidrológico"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/RIOS_PRIN_SANTA_CRUZ_2003_simplified.geojson",
        styleUrl: "/maps/mapStyles/RIOS_PRIN_SANTA_CRUZ.json"
      },
      {
        id: "sc-rios_secundarios",
        category: "Recursos Hídricos",
        name: "Ríos Secundarios",
        productName: "Ríos Secundarios",
        badge: "Hidrología",
        color: "#1E90FF",
        stats: [],
        technicalInfo: {
          context: "Cursos de agua secundarios que alimentan el sistema hídrico departamental.",
          social: "Conectividad fluvial para comunidades locales.",
          challenges: ["Contaminación", "Alteración del ciclo hidrológico"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/RIOS_SEC_SANTA_CRUZ_2003_simplified.geojson",
        styleUrl: "/maps/mapStyles/RIOS_PRIN_SANTA_CRUZ.json"
      },
      {
        id: "sc-ap_nacional",
        category: "Conservación y Cobertura",
        name: "Áreas Protegidas Nacionales",
        productName: "AP Nacional",
        badge: "Conservación",
        color: "#1B5E20",
        stats: [],
        technicalInfo: {
          context: "Áreas protegidas nacionales de Santa Cruz.",
          social: "Conservación de biodiversidad y territorios.",
          challenges: ["Incendios", "Expansión agrícola"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/AP_NACIONAL_SANTA_CRUZ.geojson",
        defaultStyle: { fillColor: '#1B5E20', color: '#004D40', weight: 2, fillOpacity: 0.6 }
      },
      {
        id: "sc-ap_municipal",
        category: "Conservación y Cobertura",
        name: "Áreas Protegidas Municipales",
        productName: "AP Municipal",
        badge: "Conservación",
        color: "#90EE90",
        stats: [],
        technicalInfo: {
          context: "Áreas protegidas municipales de Santa Cruz.",
          social: "Conservación de biodiversidad y territorios.",
          challenges: ["Incendios", "Expansión agrícola"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/AP_MUNICIPAL_SANTA_CRUZ.geojson",
        defaultStyle: { fillColor: '#90EE90', color: '#2E8B57', weight: 2, fillOpacity: 0.5, dashArray: '4, 4' }
      },
      {
        id: "sc-sitios_ramsar",
        category: "Recursos Hídricos",
        name: "Sitios Ramsar",
        productName: "Sitios Ramsar",
        badge: "Humedales",
        color: "#1f78b4",
        stats: [],
        technicalInfo: {
          context: "Actualmente, el visor espacial de Sitios Ramsar se enfoca en las cuencas de la Amazonía y el Altiplano.",
          social: "N/A",
          challenges: []
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: ""
      },
      {
        id: "sc-cuencas",
        category: "Recursos Hídricos",
        name: "Cuencas Hidrográficas",
        productName: "Cuencas Hidrográficas",
        badge: "Hidrología",
        color: "#1f78b4",
        stats: [],
        technicalInfo: {
          context: "Cuencas Hidrográficas de Nivel 2.",
          social: "N/A",
          challenges: []
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/CUENCAS_N2_2014_SANTACRUZ.geojson",
        styleUrl: "/maps/mapStyles/CUENCAS_N2_SANTACRUZ.json"
      }
    ]
  },
  "Altiplano": {
    name: "Altiplano",
    center: [-19.0, -67.5],
    zoom: 7,
    layers: [
      {
        id: "altiplano-bosques",
        category: "Conservación y Cobertura",
        name: "Bosques",
        productName: "Bosques y Queñuales",
        badge: "Cobertura Altoandina",
        color: "#2E8B57",
        stats: [],
        technicalInfo: {
          context: "Zonas de vegetación boscosa altoandina, fundamentales para la protección de suelos y microclimas.",
          social: "Sistemas agrosilvopastoriles andinos.",
          challenges: ["Clima extremo", "Sobrepastoreo"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/BOSQUES_ALTIPLANO_2024_simplified.geojson",
        styleUrl: "/maps/mapStyles/BOSQUES_ALTIPLANO_2024.json"
      },
      {
        id: "altiplano-quinua",
        category: "Sistemas Productivos",
        catalogProductId: "quinua",
        name: "Producción Quinua",
        productName: "Quinua Real",
        scientificName: "Chenopodium quinoa",
        badge: "Denominación de Origen",
        color: "#D4AF37",
        stats: [
          { label: "Familias Productoras", value: "70.000+" },
          { label: "Hectáreas", value: "120.000" },
          { label: "Zonas", value: "Oruro / Potosí" }
        ],
        technicalInfo: {
          context: "Bolivia produce la 'Quinua Real', reconocida mundialmente por su calibre y calidad nutricional superior.",
          social: "Agricultura familiar andina y sistemas comunitarios.",
          challenges: ["Degradación de suelos por mecanización", "Variabilidad climática extrema"]
        },
        gallery: [
          { url: "/images/quinua/quinua1.png", description: "Parcelas de Quinua Real en las faldas de los salares bolivianos." },
          { url: "/images/quinua/quinua4.jpg", description: "Sistemas comunitarios de siembra y protección del suelo altoandino." }
        ],
        geometryType: 'points',
        geojsonUrl: "/maps/geojson/PRODUCCION_QUINOA_ALTIPLANO_2024.geojson",
        styleUrl: "/maps/mapStyles/QUINOA_MACROREGION_ALTIPLANO.json"
      },
      {
        id: "altiplano-comunidades",
        category: "Sistemas Productivos",
        name: "Comunidades",
        productName: "Comunidades Andinas",
        badge: "Ayllus",
        color: "#D4AF37",
        stats: [],
        technicalInfo: {
          context: "Comunidades indígenas originarias campesinas del Altiplano boliviano.",
          social: "Estructuras de organización ancestral y comunitaria (Ayllus).",
          challenges: ["Migración campo-ciudad", "Escasez de agua"]
        },
        gallery: [],
        geometryType: 'points',
        geojsonUrl: "/maps/geojson/COMUNIDADES_ALTIPLANO_2024.geojson"
      },
      {
        id: "alt-rios_principales",
        category: "Recursos Hídricos",
        name: "Ríos Principales",
        productName: "Ríos Principales",
        badge: "Hidrología",
        color: "#1E90FF",
        stats: [],
        technicalInfo: {
          context: "Red hídrica vital estructurada en torno a valles de cabecera.",
          social: "Sistemas de vida y riego agrícola de altura.",
          challenges: ["Escasez de agua", "Contaminación minera"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/RIOS_PRIN_ALTIPLANO_2003_simplified.geojson",
        styleUrl: "/maps/mapStyles/RIOS_PRIN_ALTIPLANO.json"
      },
      {
        id: "alt-rios_secundarios",
        category: "Recursos Hídricos",
        name: "Ríos Secundarios",
        productName: "Ríos Secundarios",
        badge: "Hidrología",
        color: "#1E90FF",
        stats: [],
        technicalInfo: {
          context: "Arroyos y afluentes menores del ecosistema endorreico altiplánico.",
          social: "Sistemas de vida y riego agrícola de altura.",
          challenges: ["Escasez de agua", "Contaminación minera"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/RIOS_SEC_ALTIPLANO_2003_simplified.geojson",
        styleUrl: "/maps/mapStyles/RIOS_PRIN_ALTIPLANO.json"
      },
      {
        id: "altiplano-ap_nacional",
        category: "Conservación y Cobertura",
        name: "Áreas Protegidas Nacionales",
        productName: "AP Nacional",
        badge: "Conservación",
        color: "#1B5E20",
        stats: [],
        technicalInfo: {
          context: "Áreas protegidas nacionales del Altiplano.",
          social: "Conservación de biodiversidad y territorios.",
          challenges: ["Cambio climático"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/AP_NACIONAL_ALTIPLANO.geojson",
        defaultStyle: { fillColor: '#1B5E20', color: '#004D40', weight: 2, fillOpacity: 0.6 }
      },
      {
        id: "altiplano-ap_departamental",
        category: "Conservación y Cobertura",
        name: "Áreas Protegidas Departamentales",
        productName: "AP Departamental",
        badge: "Conservación",
        color: "#2E8B57",
        stats: [],
        technicalInfo: {
          context: "Áreas protegidas departamentales del Altiplano.",
          social: "Conservación de biodiversidad y territorios.",
          challenges: ["Cambio climático"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/AP_DEPARTAMENTAL_ALTIPLANO.geojson",
        defaultStyle: { fillColor: '#2E8B57', color: '#1B5E20', weight: 2, fillOpacity: 0.6 }
      },
      {
        id: "altiplano-ap_municipal",
        category: "Conservación y Cobertura",
        name: "Áreas Protegidas Municipales",
        productName: "AP Municipal",
        badge: "Conservación",
        color: "#90EE90",
        stats: [],
        technicalInfo: {
          context: "Áreas protegidas municipales del Altiplano.",
          social: "Conservación de biodiversidad y territorios.",
          challenges: ["Cambio climático"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/AP_MUNICIPAL_ALTIPLANO.geojson",
        defaultStyle: { fillColor: '#90EE90', color: '#2E8B57', weight: 2, fillOpacity: 0.5, dashArray: '4, 4' }
      },
      {
        id: "altiplano-sitios_ramsar",
        category: "Recursos Hídricos",
        name: "Sitios Ramsar",
        productName: "Sitios Ramsar",
        badge: "Humedales",
        color: "#1f78b4",
        stats: [],
        technicalInfo: {
          context: "Humedales de importancia internacional para la regulación hídrica.",
          social: "Conservación de ecosistemas acuáticos andinos.",
          challenges: ["Minería", "Reducción de cuerpos de agua"]
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/SITIOS_RAMSAR_2018_ALTIPLANO.geojson",
        styleUrl: "/maps/mapStyles/SITIOS_RAMSAR_ALTIPLANO.json"
      },
      {
        id: "altiplano-cuencas",
        category: "Recursos Hídricos",
        name: "Cuencas Hidrográficas",
        productName: "Cuencas Hidrográficas",
        badge: "Hidrología",
        color: "#1f78b4",
        stats: [],
        technicalInfo: {
          context: "Cuencas Hidrográficas de Nivel 2.",
          social: "N/A",
          challenges: []
        },
        gallery: [],
        geometryType: 'polygon',
        geojsonUrl: "/maps/geojson/CUENCAS_N2_2014_ALTIPLANO.geojson",
        styleUrl: "/maps/mapStyles/CUENCAS_N2_ALTIPLANO.json"
      }
    ]
  }
};

const getLeafletStyle = (feature: any, styleJson: any, defaultStyle?: any) => {
  const fallback = defaultStyle || { fillColor: '#2E7D32', color: '#1B5E20', weight: 1, fillOpacity: 0.6 };

  try {
    if (!styleJson || !styleJson.rules || !Array.isArray(styleJson.rules)) {
      return fallback;
    }

    // Buscar la primera regla que coincida con las propiedades del feature
    const matchingRule = styleJson.rules.find((rule: any) => {
      // Si la regla no tiene filtro, aplica por defecto
      if (!rule.filter || !Array.isArray(rule.filter) || rule.filter.length === 0) {
        return true;
      }

      const [operator, attribute, value] = rule.filter;
      const featureValue = feature?.properties?.[attribute];

      // Si la propiedad no existe en el feature y hay un filtro explícito, no coincide
      if (featureValue === undefined || featureValue === null) {
        return false;
      }

      // Evaluar la condición según el operador de la regla
      switch (operator) {
        case "==":
          // Convertimos a string para comparaciones seguras de valores (ej: 46 vs "46")
          return String(featureValue) === String(value);
        case "!=":
          return String(featureValue) !== String(value);
        case ">":
          return Number(featureValue) > Number(value);
        case "<":
          return Number(featureValue) < Number(value);
        case ">=":
          return Number(featureValue) >= Number(value);
        case "<=":
          return Number(featureValue) <= Number(value);
        default:
          return false; // Operador desconocido
      }
    });

    // Si se encontró una regla que cumple y tiene simbolizadores, retornamos su estilo
    if (matchingRule && matchingRule.symbolizers && matchingRule.symbolizers.length > 0) {
      const symbolizer = matchingRule.symbolizers[0];
      return {
        fillColor: symbolizer.color || symbolizer.fillColor || fallback.fillColor,
        color: symbolizer.outlineColor || symbolizer.strokeColor || symbolizer.color || fallback.color,
        weight: symbolizer.width || symbolizer.weight || symbolizer.outlineWidth || fallback.weight,
        fillOpacity: symbolizer.opacity !== undefined ? symbolizer.opacity : (symbolizer.fillOpacity !== undefined ? symbolizer.fillOpacity : fallback.fillOpacity)
      };
    }

    // Fallback si no aplicó ninguna regla o falta información visual
    return fallback;
  } catch (e) {
    console.warn("Error evaluating map style JSON:", e);
    return fallback;
  }
};

const customMarkerIcon = (color: string) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.4);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

const LAYER_STATS: any = {
  amazonia: {
    sitios_ramsar: {
      titulo: "Humedales",
      descripcion: "Los humedales son lugares que están cubiertos temporal o permanentemente de agua dulce o salada. Algunos pueden ser profundos y otros poco profundos. Muchos humedales están cubiertos por vegetación y son hogar de animales grandes y pequeños. Los ríos y arroyos, pantanos, curichis, palmares, lagos y lagunas, bofedales y turberas son humedales. En época de lluvia, muchas pampas y sabanas se inundan temporalmente, convirtiéndose en humedales. Esto da lugar a que peces y otros pequeños animales acuáticos lleguen a estos lugares a cumplir parte de su ciclo de vida, por ejemplo, los procesos de reproducción o fases de crecimiento.",
      importancia: "Los humedales son importantes porque brindan una variedad de servicios que benefician a la humanidad, entre ellos, la filtración del agua, el control de inundaciones, la captura de dióxido de carbono, la provisión de alimentos y recursos que sostienen la economía de las familias. Además, son el hogar de una diversidad de especies de animales: mamíferos, aves, peces e invertebrados.",
      amenazas: "Aunque son uno de los ecosistemas más productivos e importantes del mundo, los humedales están desapareciendo. Muchas de las amenazas y causas de su desaparición son: Cambio de uso del suelo, deforestación, contrucción de grandes infraestructuras, contaminación.",
      estadisticas: [
        { icono: "💧", label: "Humedales Nacionales", valor: "11" },
        { icono: "🐦", label: "Importancia", valor: "Global" }
      ],
      listaSitios: ["Río Yata", "Río Blanco", "Río Matos", "Pantanal Boliviano", "Bañados del Izozog y Río Parapeti", "Laguna Concepción"],
      graficos: []
    },
    bosques: {
      titulo: "Resumen de Bosques",
      descripcion: "El bioma amazónico en Bolivia cubre una superficie de 478,405 km², lo que representa aproximadamente el 67% de la cuenca amazónica boliviana. Según la clasificación de la Red Amazónica de Información Socioambiental Georreferenciada (RAISG, 2022), la Amazonía es el bioma más extenso de Bolivia, en contraste con los otros cuatro presentes en el territorio nacional: Andes, Chaco, Chiquitanía y Tucumano-boliviano. Este bioma se caracteriza por una gran diversidad de paisajes, que van desde bosques siempre verdes hasta un complejo mosaico de sabanas arboladas y pasturas naturales. Su fisiografía abarca desde zonas de alta montaña, que alcanzan los 4.200 m s. n. m., hasta regiones planas y onduladas, con altitudes que no superan los 300 m s. n. m.",
      estadisticas: [
        { icono: "🌳", label: "Tipos de bosque", valor: "7" },
        { icono: "🌴", label: "Especies dominantes", valor: "Múltiples" },
        { icono: "📍", label: "Áreas de aprovechamiento", valor: "Activas" },
        { icono: "🛡️", label: "Áreas Nacionales", valor: "5" }
      ],
      graficos: []
    },
    areas_potenciales: {
      titulo: "Potencial Productivo",
      descripcion: "El Asaí es el fruto de la palmera Euterpe precatoria, una especie nativa de la Amazonía que se diferencia del Asaí cultivado en otros países por su carácter silvestre y su adaptación natural a los ecosistemas amazónicos. Históricamente, el Asaí ha sido utilizado por los pueblos indígenas como alimento, bebida energética y recurso medicinal, formando parte de su identidad cultural y de sus prácticas alimentarias tradicionales.",
      estadisticas: [
        { icono: "📈", label: "Rendimiento", valor: "Alto" }
      ],
      graficos: [
        { label: "Viabilidad", porcentaje: 85, color: "bg-[#654D81]" }
      ]
    },
    comunidades: {
      titulo: "Datos Demográficos",
      descripcion: "En la cadena de valor de la fruta del Asaí participan diversos actores con roles diferenciados. En la base se encuentran las comunidades indígenas y campesinas recolectoras, responsables de la cosecha de la fruta y del manejo tradicional del bosque. Estas comunidades suelen organizarse en asociaciones y organizaciones económicas comunitarias, lo que facilita el acceso a infraestructura, proyectos y mercados.",
      estadisticas: [
        { icono: "🏘️", label: "Comunidades Totales", valor: "XXX" },
        { icono: "👥", label: "Municipios Vinculados", valor: "98" },
        { icono: "🏡", label: "Áreas Municipales", valor: "46" },
        { icono: "🗺️", label: "Áreas Departamentales", valor: "9" }
      ],
      graficos: [
        { label: "Participación Comunitaria", porcentaje: 75, color: "bg-[#B0946D]" }
      ]
    }
  },
  altiplano: {
    sitios_ramsar: {
      titulo: "Sitios Ramsar Altoandinos",
      descripcion: "Se denominan sitios Ramsar a los humedales que brindan servicios y recursos vitales al mundo. Son de importancia internacional, ya que especies como aves y peces migratorios cumplen gran parte de su ciclo de vida en estos sitios, donde se alimentan, descansan y se reproducen. Bolivia es parte de la Convención Ramsar desde 1990.",
      estadisticas: [
        { icono: "💧", label: "Humedales Nacionales", valor: "11" },
        { icono: "🦩", label: "Importancia", valor: "Global" }
      ],
      listaSitios: ["Lago Titicaca", "Uru Uru", "Los Lípez", "Cuenca del Tajzara", "Salinas de San José"],
      graficos: []
    },
    bosques: {
      titulo: "Resumen de Bosques",
      descripcion: "El Altiplano Sur, una región caracterizada por condiciones biofísicas extremas que han moldeado sistemas productivos altamente adaptativos. Este territorio se sitúa a altitudes que oscilan entre los 3.600 y más de 4.000 metros sobre el nivel del mar, con climas áridos y semiáridos, precipitaciones anuales reducidas y una marcada variabilidad climática. Los suelos del Altiplano Sur son predominantemente arenosos, con bajo contenido de materia orgánica y, en muchos casos, con presencia de salinidad.",
      estadisticas: [
        { icono: "🌳", label: "Tipos de bosque", valor: "7" },
        { icono: "🌴", label: "Especies dominantes", valor: "Múltiples" },
        { icono: "📍", label: "Áreas de aprovechamiento", valor: "Activas" },
        { icono: "🛡️", label: "Áreas Nacionales", valor: "5" }
      ],
      graficos: []
    },
    produccion_quinua: {
      titulo: "Rendimiento Agrícola",
      descripcion: "La quinua es un pseudocereal originario de los Andes, cultivado desde hace más de cinco mil años por las civilizaciones prehispánicas. Su importancia trasciende lo alimentario, constituyéndose en un elemento central de la cosmovisión andina y de los sistemas agrícolas tradicionales. Bolivia conserva una amplia diversidad genética de quinua, con múltiples ecotipos adaptados a distintos pisos ecológicos. La Quinua Real, producida en el Altiplano Sur, es especialmente valorada por el tamaño de su grano y sus características organolépticas, lo que refuerza su posicionamiento en mercados especializados.",
      estadisticas: [
        { icono: "🌾", label: "Producción", valor: "Premium" }
      ],
      graficos: [
        { label: "Calidad", porcentaje: 95, color: "bg-[#B0946D]" }
      ]
    },
    comunidades: {
      titulo: "Datos Demográficos",
      descripcion: "La cadena de valor de la quinua involucra a una diversidad de actores públicos, privados y comunitarios que interactúan de manera interdependiente. En la base de la cadena se encuentran los pequeños productores y comunidades indígenas, quienes mantienen y transmiten conocimientos ancestrales asociados al cultivo. Las organizaciones de productores, cooperativas y asociaciones desempeñan un rol clave en la agregación de valor, el acceso a certificaciones y la comercialización conjunta.",
      estadisticas: [
        { icono: "🏘️", label: "Comunidades Totales", valor: "XXX" },
        { icono: "👥", label: "Municipios Vinculados", valor: "98" },
        { icono: "🏡", label: "Áreas Municipales", valor: "46" },
        { icono: "🗺️", label: "Áreas Departamentales", valor: "9" }
      ],
      graficos: [
        { label: "Participación Comunitaria", porcentaje: 75, color: "bg-[#B0946D]" }
      ]
    }
  },
  santa_cruz: {
    sitios_ramsar: {
      titulo: "Sitios Ramsar en Bolivia",
      descripcion: "Se denominan sitios Ramsar a los humedales que brindan servicios y recursos vitales al mundo. Actualmente, el visor espacial enfoca la carga de datos en las cuencas íntegras de la Amazonía y el Altiplano.",
      estadisticas: [
        { icono: "💧", label: "Humedales Nacionales", valor: "11" },
        { icono: "🌍", label: "Importancia", valor: "Global" }
      ],
      listaSitios: ["Pantanal Boliviano", "Laguna Concepción", "Bañados del Izozog y Río Parapeti", "Palmar de las Islas"],
      graficos: []
    }
  },
  areas_protegidas: {
    titulo: "Áreas Protegidas",
    descripcion: "Zonas de alta biodiversidad resguardadas mediante categorías de protección nacional, departamental y municipal.",
    estadisticas: [],
    graficos: []
  },
  rios: {
    titulo: "Resumen Hidrológico",
    estadisticas: [
      { icono: "📍", label: "Ríos principales", valor: "12" },
      { icono: "👥", label: "Comunidades conectadas", valor: "87" },
      { icono: "🌴", label: "Áreas potenciales de asaí cercanas", valor: "34" }
    ],
    graficos: [
      { label: "Vías de acceso fluvial (Alta conectividad)", porcentaje: 85, color: "bg-blue-500" }
    ]
  },
  bosques: {
    titulo: "Resumen de Bosques",
    estadisticas: [
      { icono: "🌳", label: "Tipos de bosque", valor: "7" },
      { icono: "🌴", label: "Especies dominantes", valor: "Múltiples" },
      { icono: "📍", label: "Áreas de aprovechamiento", valor: "Activas" },
      { icono: "🛡️", label: "Áreas Nacionales", valor: "5" }
    ],
    graficos: []
  },
  comunidades: {
    titulo: "Datos Demográficos",
    estadisticas: [
      { icono: "🏘️", label: "Comunidades Totales", valor: "XXX" },
      { icono: "👥", label: "Municipios Vinculados", valor: "98" },
      { icono: "🏡", label: "Áreas Municipales", valor: "46" },
      { icono: "🗺️", label: "Áreas Departamentales", valor: "9" }
    ],
    graficos: [
      { label: "Participación Comunitaria", porcentaje: 75, color: "bg-[#B0946D]" }
    ]
  },
  areas_potenciales: {
    titulo: "Potencial Productivo",
    estadisticas: [
      { icono: "📈", label: "Rendimiento", valor: "Alto" }
    ],
    graficos: [
      { label: "Viabilidad", porcentaje: 85, color: "bg-[#654D81]" }
    ]
  },
  produccion_quinua: {
    titulo: "Rendimiento Agrícola",
    estadisticas: [
      { icono: "🌾", label: "Producción", valor: "Premium" }
    ],
    graficos: [
      { label: "Calidad", porcentaje: 95, color: "bg-[#B0946D]" }
    ]
  }
};

const getStatsKey = (layerId: string) => {
  if (layerId.includes('rios')) return 'rios';
  if (layerId.includes('bosques')) return 'bosques';
  if (layerId.includes('comunidades')) return 'comunidades';
  if (layerId.includes('asai')) return 'areas_potenciales';
  if (layerId.includes('quinua')) return 'produccion_quinua';
  if (layerId.includes('ap_nacional') || layerId.includes('ap_departamental') || layerId.includes('ap_municipal') || layerId.includes('areas_protegidas')) return 'areas_protegidas';
  if (layerId.includes('sitios_ramsar')) return 'sitios_ramsar';
  return 'bosques';
};

// Función robusta para asegurar que el panel izquierdo siempre encuentre los datos
const obtenerDatosCapa = (region: string, capa: string) => {
  if (!region || !capa || !LAYER_STATS) return null;
  
  // Normalizamos el texto (quitamos espacios, tildes y pasamos a minúsculas)
  const regionNormalizada = region
    .toLowerCase()
    .trim()
    .replace(" ", "_")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  
  // Primero intentamos buscar con la llave normalizada (ej. 'santa_cruz' o 'amazonia')
  // @ts-ignore
  if (LAYER_STATS[regionNormalizada] && LAYER_STATS[regionNormalizada][capa]) {
    // @ts-ignore
    return LAYER_STATS[regionNormalizada][capa];
  }
  
  // Si no existe un nodo independiente para santa_cruz (debido al rollback), 
  // forzamos temporalmente a que lea los datos base para que el panel no quede vacío
  // @ts-ignore
  if (regionNormalizada === "santa_cruz" && LAYER_STATS["amazonia"]) {
    // @ts-ignore
    return LAYER_STATS["amazonia"][capa];
  }

  // Fallback para diccionarios de un solo nivel (si LAYER_STATS no está dividido por regiones)
  if (LAYER_STATS[capa]) {
      return LAYER_STATS[capa];
  }

  return null;
};

// --- COMPONENTS ---

function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

function ZoomController({ activeLayer }: { activeLayer: MapLayer }) {
  const map = useMap();

  useEffect(() => {
    if (activeLayer.id.includes("bosques")) {
      map.setMaxZoom(12);
      if (map.getZoom() > 12) {
        map.setZoom(12);
      }
    } else {
      map.setMaxZoom(18);
    }
  }, [activeLayer, map]);

  return null;
}

let cachedSantaCruzMaskGeojson: any = null;
let cachedSantaCruzBounds: L.LatLngBounds | null = null;

const SantaCruzMaskEffect = () => {
  const map = useMap();
  const [maskGeojson, setMaskGeojson] = useState<any>(cachedSantaCruzMaskGeojson);

  useEffect(() => {
    if (cachedSantaCruzMaskGeojson && cachedSantaCruzBounds) {
      map.fitBounds(cachedSantaCruzBounds, { padding: [50, 50], duration: 1.5 });
      return;
    }

    fetch('/maps/geojson/LIMITE_MACROREGION_SANTA_CRUZ.geojson')
      .then(res => res.json())
      .then(data => {
        if (data && data.features && data.features.length > 0) {
          const originalGeom = data.features[0].geometry;
          
          const geoJsonLayer = L.geoJSON(data);
          cachedSantaCruzBounds = geoJsonLayer.getBounds();
          map.fitBounds(cachedSantaCruzBounds, { padding: [50, 50], duration: 1.5 });

          const worldCoords = [
            [
              [-180, -90],
              [-180, 90],
              [180, 90],
              [180, -90],
              [-180, -90]
            ]
          ];
          
          let holes: any[] = [];
          if (originalGeom.type === 'Polygon') {
            holes = originalGeom.coordinates;
          } else if (originalGeom.type === 'MultiPolygon') {
            holes = originalGeom.coordinates.flat(1);
          } else if (originalGeom.type === 'MultiLineString') {
            holes = originalGeom.coordinates.map((line: any[]) => {
              const ring = [...line];
              const first = ring[0];
              const last = ring[ring.length - 1];
              if (first[0] !== last[0] || first[1] !== last[1]) {
                ring.push(first);
              }
              return ring;
            });
          }

          cachedSantaCruzMaskGeojson = {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Polygon",
                  coordinates: [worldCoords[0], ...holes]
                }
              }
            ]
          };
          setMaskGeojson(cachedSantaCruzMaskGeojson);
        }
      })
      .catch(console.error);
  }, [map]);

  if (!maskGeojson) return null;

  return (
    <GeoJSON
      data={maskGeojson}
      style={{
        fillColor: '#ffffff',
        fillOpacity: 0.7,
        color: 'transparent',
        weight: 0
      }}
      interactive={false}
    />
  );
};

export default function Explorador() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const mapRef = useRef<L.Map | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'fotos' | 'buscador'>('fotos');

  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Initialize from URL params if available
  const initialRegionParam = searchParams.get("region") as RegionKey;
  const initialRegion = (initialRegionParam && macroRegions[initialRegionParam]) ? initialRegionParam : "Amazonía";
  const initialLayer = searchParams.get("layer") || macroRegions[initialRegion].layers[0].id;

  const [activeRegionKey, setActiveRegionKey] = useState<RegionKey>(initialRegion);
  const [activeLayerId, setActiveLayerId] = useState<string>(initialLayer);
  const [categoriaAbierta, setCategoriaAbierta] = useState<string | null>('Conservación y Cobertura');

  const [activeBioKey, setActiveBioKey] = useState<string | null>(null);

  useEffect(() => {
    const keyMapping: Record<string, string> = {
      "amazon-bosques": "amazonia_bosques",
      "amazon-asai": "amazonia_areas_potenciales",
      "amazon-comunidades": "amazonia_comunidades",
      "amazon-rios": "amazonia_rios",
      "sc-rios": "sc_rios",
      "altiplano-bosques": "altiplano_bosques",
      "altiplano-quinua": "altiplano_produccion",
      "altiplano-comunidades": "altiplano_comunidades",
      "altiplano-rios": "altiplano_rios"
    };
    setActiveBioKey(keyMapping[activeLayerId] || null);
  }, [activeLayerId]);

  // Map Data State
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [styleData, setStyleData] = useState<any>(null);
  const [isLoadingMap, setIsLoadingMap] = useState<boolean>(false);
  const [limiteGeoJson, setLimiteGeoJson] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLimite = async () => {
      setLimiteGeoJson(null);
      let filename = "";
      if (activeRegionKey === "Amazonía") filename = "LIMITE_MACROREGION_AMAZONIA.geojson";
      else if (activeRegionKey === "Altiplano") filename = "LIMITE_MACROREGION_ALTIPLANO.geojson";
      else if (activeRegionKey === "Santa Cruz") filename = "LIMITE_MACROREGION_SANTA_CRUZ.geojson";

      if (filename) {
        try {
          const response = await fetch(`/maps/geojson/${filename}`);
          const data = await response.json();
          if (isMounted) {
            setLimiteGeoJson(data);
          }
        } catch (error) {
          console.error("Error cargando el límite de la macroregión:", error);
        }
      }
    };
    fetchLimite();
    return () => {
      isMounted = false;
    };
  }, [activeRegionKey]);

  useEffect(() => {
    const regionParam = searchParams.get("region") as RegionKey;
    const layerParam = searchParams.get("layer");

    if (regionParam && macroRegions[regionParam]) {
      setActiveRegionKey(regionParam);
      if (layerParam) {
        setActiveLayerId(layerParam);
      } else {
        setActiveLayerId(macroRegions[regionParam].layers[0].id);
      }
    }
  }, [searchParams]);

  const activeRegion = macroRegions[activeRegionKey];
  const activeLayer = activeRegion.layers.find(l => l.id === activeLayerId) || activeRegion.layers[0];
  const dataActual = obtenerDatosCapa(activeRegionKey, getStatsKey(activeLayer.id));

  const isComunidadesLayer = activeLayer.id.includes('comunidades');

  const filteredCommunities = useMemo(() => {
    if (!isComunidadesLayer || !geoJsonData || !geoJsonData.features) return [];
    const term = searchTerm.toLowerCase().trim();
    return geoJsonData.features.filter((feature: any) => {
      const name = feature.properties?.ciu_com || feature.properties?.name || feature.properties?.NOMBRE || feature.properties?.Comunidad || '';
      if (!name) return false;
      return name.toLowerCase().includes(term);
    });
  }, [geoJsonData, isComunidadesLayer, searchTerm]);

  const handleCommunityClick = (feature: any) => {
    setSelectedCommunity(feature);
    if (mapRef.current && feature.geometry && feature.geometry.coordinates) {
      // GeoJSON coordinates son [lng, lat]
      const [lng, lat] = feature.geometry.coordinates;
      mapRef.current.flyTo([lat, lng], 14, { duration: 1.5 });
    }
  };

  useEffect(() => {
    setCurrentImageIndex(0);
    setSelectedCommunity(null);
    setSearchTerm('');
    setActiveTab('fotos');
  }, [activeLayerId, activeRegionKey]);

  // Lazy Fetching Effect
  useEffect(() => {
    let isMounted = true;

      const fetchMapData = async () => {
      setIsLoadingMap(true);
      setGeoJsonData(null);
      setStyleData(null);

      try {
        if (!activeLayer.geojsonUrl) {
          setGeoJsonData(null);
          setStyleData(null);
          if (isMounted) setIsLoadingMap(false);
          return;
        }

        const fetchGeoJson = async () => {
            const response = await fetch(activeLayer.geojsonUrl);
            let textData = await response.text(); // Leer como texto crudo

            // Sanitización de palabras corruptas conocidas originadas en el SIG
            textData = textData
              .replace(/Amaznico/g, 'Amazónico')
              .replace(/Amaznico/g, 'Amazónico')
              .replace(/Hmedo/g, 'Húmedo')
              .replace(/Hmedo/g, 'Húmedo')
              .replace(/Preandino/g, 'Preandino'); // Agrega aquí cualquier otra si es necesario

            return JSON.parse(textData);
          };

          const promises: Promise<any>[] = [
            fetchGeoJson()
          ];

          if (activeLayer.styleUrl) {
            promises.push(fetch(activeLayer.styleUrl).then(res => res.json()));
          }

          const results = await Promise.all(promises);

          if (isMounted) {
            setGeoJsonData(results[0]);
            if (activeLayer.styleUrl && results[1]) {
              setStyleData(results[1]);
            }
          }
      } catch (error) {
        console.error("Error cargando los datos del mapa:", error);
      } finally {
        if (isMounted) {
          setIsLoadingMap(false);
        }
      }
    };

    fetchMapData();

    return () => {
      isMounted = false;
    };
  }, [activeLayer.id]);

  const nextImage = () => {
    if (activeLayer.gallery.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % activeLayer.gallery.length);
  };

  const prevImage = () => {
    if (activeLayer.gallery.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + activeLayer.gallery.length) % activeLayer.gallery.length);
  };

  const handleOnEachFeature = (feature: any, layer: any) => {
    const name = feature.properties?.name || feature.properties?.NOMBRE || activeLayer.name;
    
    if (activeLayer.id.toLowerCase().includes('rios')) {
      const nombreRio = feature.properties?.NOMBRE || feature.properties?.NOM_RIO || feature.properties?.NOM_CURSO || "Río Principal";
      layer.bindTooltip(nombreRio, {
        sticky: true,
        direction: 'auto',
        className: 'custom-river-tooltip'
      });
    }

    if (activeLayer.id.toLowerCase().includes('sitios_ramsar')) {
      const p = feature.properties;
      const sitioName = p["NOM_SRM"] || p["NOM SRM"] || p["NOMBRE"] || name || "Sitio Ramsar";
      const dep = p["dep"] || p["DEP"] || "No especificado";
      const prov = p["prov"] || p["PROV"] || "No especificada";
      const mun = p["mun"] || p["MUN"] || "No especificado";
      
      const ramsarPropsHtml = `
        <li class="flex justify-between items-start py-1.5 border-b border-gray-100 last:border-0 gap-4">
          <span class="text-xs font-semibold text-gray-600 capitalize shrink-0">Departamento:</span>
          <span class="text-xs text-gray-800 text-right break-words">${dep}</span>
        </li>
        <li class="flex justify-between items-start py-1.5 border-b border-gray-100 last:border-0 gap-4">
          <span class="text-xs font-semibold text-gray-600 capitalize shrink-0">Provincia:</span>
          <span class="text-xs text-gray-800 text-right break-words">${prov}</span>
        </li>
        <li class="flex justify-between items-start py-1.5 border-b border-gray-100 last:border-0 gap-4">
          <span class="text-xs font-semibold text-gray-600 capitalize shrink-0">Municipio:</span>
          <span class="text-xs text-gray-800 text-right break-words">${mun}</span>
        </li>
      `;

      layer.bindPopup(`
        <div class="p-2 min-w-[220px] max-w-[300px] bg-white rounded-lg">
          <h4 class="m-0 mb-2 font-bold text-[#654D81] font-sans text-sm border-b pb-1">${sitioName}</h4>
          <p class="m-0 mb-3 text-[11px] text-gray-500">Capa: ${activeLayer.name}</p>
          <ul class="m-0 p-0 list-none max-h-[200px] overflow-y-auto pr-1">
            ${ramsarPropsHtml}
          </ul>
        </div>
      `);
      return;
    }

    const ignoreKeys = ['OBJECTID', 'Shape_Length', 'Shape_Area', 'ID', 'FID'];
    const props = Object.entries(feature.properties || {})
      .filter(([key, value]) => !ignoreKeys.includes(key) && value !== null && value !== '');
    
    const propsHtml = props.map(([key, value]) => `
      <li class="flex justify-between items-start py-1.5 border-b border-gray-100 last:border-0 gap-4">
        <span class="text-xs font-semibold text-gray-600 capitalize shrink-0">${key.replace(/_/g, ' ')}:</span>
        <span class="text-xs text-gray-800 text-right break-words">${value}</span>
      </li>
    `).join('');

    layer.bindPopup(`
      <div class="p-2 min-w-[220px] max-w-[300px] bg-white rounded-lg">
        <h4 class="m-0 mb-2 font-bold text-[#654D81] font-sans text-sm border-b pb-1">${name}</h4>
        <p class="m-0 mb-3 text-[11px] text-gray-500">Capa: ${activeLayer.name}</p>
        <ul class="m-0 p-0 list-none max-h-[200px] overflow-y-auto pr-1">
          ${propsHtml}
        </ul>
      </div>
    `);
  };

  const capasAgrupadas = activeRegion.layers.reduce((acc, layer) => {
    const cat = layer.category || 'Otras';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(layer);
    return acc;
  }, {} as Record<string, MapLayer[]>);

  return (
    <div className="h-[100dvh] w-full relative flex flex-col bg-surface overflow-hidden pt-16">
      {/* Botón Flotante (Solo Móvil) */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex md:hidden items-center justify-center gap-2 bg-[#B0946D] text-white px-6 py-3 rounded-full font-black uppercase tracking-widest shadow-2xl border-2 border-[#B0946D]/50 active:scale-95 transition-transform"
      >
        <MapPin className="w-5 h-5" />
        Explorar Capas
      </button>

      {/* MAP CONTAINER */}
      <div className="absolute inset-0 z-0 top-16">
        <MapContainer
          ref={mapRef}
          center={activeRegion.center}
          zoom={activeRegion.zoom}
          className="h-full w-full"
          zoomControl={false}
          attributionControl={false}
          preferCanvas={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={activeRegion.center} zoom={activeRegion.zoom} />
          <ZoomController activeLayer={activeLayer} />
          <ScaleControl position="bottomright" />

          {/* Loader */}
          {isLoadingMap && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] flex flex-col items-center justify-center p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-outline-variant/20">
              <Loader2 className="w-8 h-8 animate-spin text-[#654D81] mb-2" />
              <span className="text-sm font-bold text-[#654D81] tracking-wide">Cargando datos espaciales...</span>
            </div>
          )}

          {/* Efecto Máscara para Santa Cruz */}
          {activeRegionKey === 'Santa Cruz' && <SantaCruzMaskEffect />}

          {/* Límite de la Macroregión */}
          {limiteGeoJson && (
            <GeoJSON
              key={`limite-${activeRegionKey}`}
              data={limiteGeoJson}
              interactive={false}
              style={{
                fillOpacity: 0,
                color: '#4A4A4A',
                weight: 3,
                dashArray: '5, 10'
              }}
            />
          )}

          {/* Render Active Layer Geometry */}
          {!isLoadingMap && geoJsonData && activeLayer.geometryType === 'polygon' && (
            <GeoJSON
              key={`${activeLayer.id}-poly`}
              data={geoJsonData}
              style={(feature) => {
                const baseStyle = getLeafletStyle(feature, styleData, activeLayer.defaultStyle);
                if (activeLayer.id === 'amazon-asai') {
                  return {
                    ...baseStyle,
                    fillColor: '#6E0792',
                    color: '#6E0792',
                    fillOpacity: 0.6,
                    weight: 2
                  };
                }
                if (activeLayer.id.toLowerCase().includes('rios')) {
                  return {
                    ...baseStyle,
                    weight: 4
                  };
                }
                return baseStyle;
              }}
              pointToLayer={(feature, latlng) => {
                return L.circleMarker(latlng, {
                  radius: 9, // Aumentado de 5 a 9 para mejor visibilidad táctil
                  fillColor: "#B0946D",
                  color: "#FFFFFF",
                  weight: 2, // Borde más grueso para resaltar sobre el fondo
                  opacity: 1,
                  fillOpacity: 0.9
                });
              }}
              onEachFeature={handleOnEachFeature}
            />
          )}

          {!isLoadingMap && geoJsonData && activeLayer.geometryType === 'points' && (
            <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
              <GeoJSON
                key={`${activeLayer.id}-points`}
                data={geoJsonData}
                pointToLayer={(feature, latlng) => {
                  return L.circleMarker(latlng, {
                    radius: 9, // Aumentado de 5 a 9 para mejor visibilidad táctil
                    fillColor: "#B0946D",
                    color: "#FFFFFF",
                    weight: 2, // Borde más grueso para resaltar sobre el fondo
                    opacity: 1,
                    fillOpacity: 0.9
                  });
                }}
                onEachFeature={(feature, layer) => {
                  const name = feature.properties?.name || feature.properties?.NOMBRE || feature.properties?.Comunidad || 'Punto de interés';
                  
                  const ignoreKeys = ['OBJECTID', 'Shape_Length', 'Shape_Area', 'ID', 'FID'];
                  const props = Object.entries(feature.properties || {})
                    .filter(([key, value]) => !ignoreKeys.includes(key) && value !== null && value !== '');
                  
                  const propsHtml = props.map(([key, value]) => `
                    <li class="flex justify-between items-start py-1.5 border-b border-gray-100 last:border-0 gap-4">
                      <span class="text-xs font-semibold text-gray-600 capitalize shrink-0">${key.replace(/_/g, ' ')}:</span>
                      <span class="text-xs text-gray-800 text-right break-words">${value}</span>
                    </li>
                  `).join('');

                  layer.bindPopup(`
                    <div class="p-2 min-w-[220px] max-w-[300px] bg-white rounded-lg">
                      <h4 class="m-0 mb-2 font-bold text-[#654D81] font-sans text-sm border-b pb-1">${name}</h4>
                      <p class="m-0 mb-3 text-[11px] text-gray-500">Capa: ${activeLayer.productName}</p>
                      <ul class="m-0 p-0 list-none max-h-[200px] overflow-y-auto pr-1">
                        ${propsHtml}
                      </ul>
                    </div>
                  `);
                }}
              />
            </MarkerClusterGroup>
          )}

          {selectedCommunity && (
            <CircleMarker 
              center={[selectedCommunity.geometry.coordinates[1], selectedCommunity.geometry.coordinates[0]]} 
              radius={12} 
              pathOptions={{ fillColor: '#654d81', color: '#ffffff', weight: 3, fillOpacity: 1 }}
            >
              <Tooltip permanent direction="top" className="font-bold text-sm">
                {selectedCommunity.properties.ciu_com || selectedCommunity.properties.name || selectedCommunity.properties.NOMBRE || selectedCommunity.properties.Comunidad || 'Comunidad'}
              </Tooltip>
            </CircleMarker>
          )}

        </MapContainer>
      </div>

      {/* FLYING LEFT PANEL */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.aside
            initial={{ x: -450, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -450, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className={cn(
              "flex flex-col transition-all duration-300",
              // Móvil: Modal a pantalla completa controlado por isMobileMenuOpen
              isMobileMenuOpen 
                ? "fixed inset-0 z-[2000] overflow-y-auto bg-[#EBEBEB] p-4" 
                : "hidden overflow-hidden",
              // Escritorio: Flotante habitual ignorando el estado móvil
              "md:flex md:fixed md:left-4 md:top-24 md:w-[450px] md:h-[calc(100vh-7rem)] md:overflow-y-auto md:bg-[#EFEAE2]/95 md:backdrop-blur-md md:z-40 md:rounded-[2.5rem] md:shadow-2xl md:border md:border-outline-variant/20 md:p-0 md:inset-auto custom-scrollbar"
            )}
          >
            {/* Top Selector Section */}
            <div className="p-8 bg-gradient-to-b from-[#654D81]/5 to-transparent border-b border-outline-variant/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#B0946D] pulse-infinite" />
                  <span className="text-[10px] font-bold text-[#654D81]/85 uppercase tracking-[0.2em]">Atlas Bioeconómico</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-[#654D81]/5 rounded-full text-[#4D4D4D] flex md:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative group mb-4">
                <select
                  value={activeRegionKey}
                  onChange={(e) => {
                    const newRegion = e.target.value as RegionKey;
                    setActiveRegionKey(newRegion);
                    setActiveLayerId(macroRegions[newRegion].layers[0].id);
                  }}
                  className="w-full border-2 border-outline-variant/30 rounded-2xl px-5 py-4 appearance-none focus:outline-none focus:border-[#664e82] focus:ring-4 focus:ring-[#664e82]/10 transition-all cursor-pointer shadow-md group-hover:border-[#664e82]/50 font-bold text-base text-[#664e82] bg-white uppercase tracking-wide"
                >
                  {(Object.keys(macroRegions) as RegionKey[]).map((key) => (
                    <option key={key} value={key}>
                      {macroRegions[key].name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#654D81] group-hover:scale-110 transition-transform">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>

              {/* Acordeón Selector de Capas */}
              <div className="flex flex-col gap-2">
                {Object.keys(capasAgrupadas).map(categoria => (
                  <div key={categoria} className="flex flex-col border border-outline-variant/20 rounded-xl overflow-hidden bg-white/50">
                    <button
                      onClick={() => setCategoriaAbierta(categoriaAbierta === categoria ? null : categoria)}
                      className="flex items-center justify-between w-full px-4 py-3 font-semibold text-xl text-gray-800 bg-white hover:text-[#664e82] transition-colors uppercase tracking-wider"
                    >
                      <span>{categoria}</span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform",
                          categoriaAbierta === categoria ? "rotate-180" : ""
                        )}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {categoriaAbierta === categoria && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="flex flex-col gap-1 p-2"
                        >
                          {capasAgrupadas[categoria].map(layer => {
                            const isActiva = activeLayerId === layer.id;
                            return (
                              <button
                                key={layer.id}
                                onClick={() => setActiveLayerId(layer.id)}
                                className={cn(
                                  "flex items-center justify-between w-full p-2 rounded-lg transition-all text-left",
                                  isActiva
                                    ? "bg-[#664e82]/10 text-[#664e82] font-medium border-l-4 border-[#664e82]"
                                    : "bg-transparent text-gray-600 hover:bg-gray-50"
                                )}
                              >
                                <span className="text-sm">{layer.productName}</span>
                                {isActiva ? (
                                  <div className="w-2 h-2 rounded-full bg-[#664e82] shrink-0" />
                                ) : (
                                  <div className="w-2 h-2 rounded-full border border-gray-300 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col">
              <div className="p-8 pb-6">
                {dataActual ? (
                  <>
                    <div className="flex flex-col gap-1 mb-6">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="font-display text-5xl font-black text-[#654D81] tracking-tighter leading-none">{dataActual.titulo}</h2>
                      </div>
                      <div className="font-display inline-block px-3 py-1 bg-[#654D81]/10 text-[#654D81] rounded-lg text-[10px] font-bold uppercase tracking-widest border border-[#654D81]/20 h-fit w-fit mt-1">
                        {activeLayer.badge}
                      </div>
                      {activeLayer.scientificName && (
                        <p className="font-display italic text-xl text-[#4D4D4D] font-medium opacity-80 mt-2">{activeLayer.scientificName}</p>
                      )}
                    </div>

                    {dataActual.estadisticas?.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 my-6">
                        <AnimatePresence mode="popLayout">
                          {dataActual.estadisticas.map((stat: any, i: number) => (
                            <motion.div
                              key={`${activeLayer.id}-stat-${i}`}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
                              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-start group hover:shadow-md transition-shadow"
                            >
                              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">{stat.icono}</div>
                              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wide leading-tight mb-1">{stat.label}</div>
                              <div className="text-xl font-black text-[#654D81]">{stat.valor}</div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                    
                    {dataActual.graficos?.length > 0 && (
                      <div className="space-y-4 mb-8">
                        {dataActual.graficos.map((graf: any, idx: number) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-[#654D81] uppercase tracking-wide">
                              <span>{graf.label}</span>
                              <span>{graf.porcentaje}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-[#EBEBEB] rounded-full overflow-hidden border border-outline-variant/10">
                              <div className={`h-full ${graf.color} rounded-full transition-all duration-1000`} style={{ width: `${graf.porcentaje}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-6">
                      <div className="min-h-[120px]">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`${activeLayer.id}-desc`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-sm text-[#4D4D4D] leading-relaxed p-1"
                          >
                            <p className="mb-4">{(dataActual as any).descripcion || (activeBioKey && bioeconomyData[activeBioKey]?.descripcion) || activeLayer.technicalInfo?.context || "Descripción no disponible."}</p>

                            {/* Renderizado dinámico de Importancia */}
                            {(dataActual as any)?.importancia && (
                              <div className="mt-4 p-4 bg-blue-50/80 border border-blue-200 rounded-xl text-sm text-blue-900 shadow-sm animate-fade-in-up">
                                <h4 className="font-bold mb-1 flex items-center gap-2"><span className="text-blue-500">ℹ️</span> Importancia</h4>
                                <p>{(dataActual as any).importancia}</p>
                              </div>
                            )}

                            {/* Renderizado dinámico de Amenazas */}
                            {(dataActual as any)?.amenazas && (
                              <div className="mt-4 p-4 bg-red-50/80 border border-red-200 rounded-xl text-sm text-red-900 shadow-sm animate-fade-in-up">
                                <h4 className="font-bold mb-1 flex items-center gap-2"><span className="text-red-500">⚠️</span> Amenazas</h4>
                                <p>{(dataActual as any).amenazas}</p>
                              </div>
                            )}

                            {/* Renderizado dinámico de la lista de Sitios (si existe en los datos) */}
                            {(dataActual as any)?.listaSitios && (
                              <div className="mt-6 animate-fade-in-up">
                                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                                  Humedales Destacados de la Región
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                  {(dataActual as any).listaSitios.map((sitio: string, index: number) => (
                                    <div 
                                      key={index}
                                      className="flex items-center p-2.5 bg-[#f0f4f8] rounded-lg text-xs font-semibold text-[#2c3e50] border border-[#d1d9e6] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-[#e2e8f0] hover:text-[#1a202c] cursor-default"
                                    >
                                      <span className="mr-2 text-blue-500 animate-pulse">💧</span>
                                      {sitio}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-1 mb-6">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="font-display text-4xl font-black text-[#654D81] tracking-tighter leading-none opacity-50">Explorador Bioeconómico</h2>
                      </div>
                    </div>
                    <div className="min-h-[120px] flex items-center mt-8">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key="fallback-desc"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-[#4D4D4D] leading-relaxed p-1 italic opacity-80"
                        >
                          <p>Selecciona una capa temática en el menú superior para explorar su impacto bioeconómico.</p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </div>


            </div>

            <div className="h-4 bg-[#EFEAE2]" />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* FLYING RIGHT PANEL (GALLERY OR INSIGHT CARD) */}
      <AnimatePresence>
        {isGalleryOpen && (activeLayer.gallery.length > 0 || isComunidadesLayer) && (
          <motion.aside
            initial={{ x: 450, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 450, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed right-4 top-24 bottom-4 w-[calc(100%-2rem)] sm:w-[400px] bg-[#EFEAE2]/95 backdrop-blur-md z-40 rounded-[2.5rem] shadow-2xl border border-outline-variant/20 flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between bg-[#654D81]/5">
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-[#654D81]" />
                <span className="text-xs font-black text-[#654D81] uppercase tracking-[0.2em]">
                  Estadísticas y Evidencia
                </span>
              </div>
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="p-2 hover:bg-[#654D81]/10 rounded-full text-[#4D4D4D] transition-colors"
                title="Cerrar Panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow flex flex-col p-6 overflow-hidden">
              {isComunidadesLayer && activeLayer.gallery.length > 0 && (
                <div className="flex gap-4 border-b border-gray-200 mb-6 shrink-0">
                  <button
                    onClick={() => setActiveTab('fotos')}
                    className={cn(
                      "pb-3 text-sm font-bold transition-colors",
                      activeTab === 'fotos' 
                        ? "border-b-2 border-[#654d81] text-[#654d81]" 
                        : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    Contexto Visual
                  </button>
                  <button
                    onClick={() => setActiveTab('buscador')}
                    className={cn(
                      "pb-3 text-sm font-bold transition-colors",
                      activeTab === 'buscador' 
                        ? "border-b-2 border-[#654d81] text-[#654d81]" 
                        : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    Buscar Comunidades
                  </button>
                </div>
              )}

              {(!isComunidadesLayer || activeTab === 'fotos') && activeLayer.gallery.length > 0 && (
                <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar pr-2">
                  {/* Image Carousel */}
                  <div className="shrink-0 relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-black/5 mb-6 group shadow-lg">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeLayer.gallery[currentImageIndex]?.url}
                        src={activeLayer.gallery[currentImageIndex]?.url}
                        alt="Gallery item"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                      />
                    </AnimatePresence>

                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-90 pointer-events-none" />

                    {/* Carousel Overlays / Nav */}
                    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10">
                      <button
                        onClick={prevImage}
                        className="w-12 h-12 rounded-full bg-[#EFEAE2]/80 backdrop-blur-md shadow-lg flex items-center justify-center text-[#654D81] pointer-events-auto hover:bg-[#EFEAE2] active:scale-90 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="w-12 h-12 rounded-full bg-[#EFEAE2]/80 backdrop-blur-md shadow-lg flex items-center justify-center text-[#654D81] pointer-events-auto hover:bg-[#EFEAE2] active:scale-90 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Description Overlay - High Contrast */}
                    <div className="absolute inset-x-0 bottom-0 p-8 pt-12 z-10">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={activeLayer.gallery[currentImageIndex]?.description}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.5 }}
                          className="text-white text-lg font-medium leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                        >
                          {activeLayer.gallery[currentImageIndex]?.description}
                        </motion.p>
                      </AnimatePresence>
                    </div>

                    {/* Indicadores de posición */}
                    <div className="absolute top-4 right-6 flex gap-1.5 z-10">
                      {activeLayer.gallery.map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-2 h-2 rounded-full transition-all border border-white/50",
                            currentImageIndex === i ? "bg-white w-6" : "bg-white/30"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Info Adicional / Thumbnails */}
                  <div className="shrink-0 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-3 gap-2">
                      {activeLayer.gallery.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={cn(
                            "aspect-square rounded-2xl overflow-hidden border-2 transition-all",
                            currentImageIndex === i ? "border-[#B0946D] scale-95 shadow-inner" : "border-transparent opacity-60 hover:opacity-100"
                          )}
                        >
                          <img src={img.url} className="w-full h-full object-cover" alt="" />
                        </button>
                      ))}
                    </div>

                    <div className="mt-8 p-6 bg-[#654D81]/5 rounded-[2rem] border border-[#654D81]/15">
                      <h4 className="text-[10px] font-black text-[#654D81] uppercase tracking-[0.2em] mb-3">Contexto Visual</h4>
                      <p className="text-xs text-[#4D4D4D] leading-relaxed">
                        Esta galería muestra evidencias recolectadas en campo sobre {activeLayer.name} permitiendo una comprensión visual del impacto bioeconómico.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isComunidadesLayer && (activeTab === 'buscador' || activeLayer.gallery.length === 0) && geoJsonData && (
                <div className="flex flex-col flex-1 overflow-hidden">
                  <div className="mb-4 shrink-0">
                    <input
                      type="text"
                      placeholder="Buscar comunidad..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#654D81]/50 focus:border-transparent text-sm text-gray-800 placeholder-gray-400 shadow-sm transition-all"
                    />
                  </div>
                  <div className="flex-grow overflow-y-auto custom-scrollbar bg-white rounded-2xl border border-gray-100 shadow-sm">
                    {filteredCommunities.length > 0 ? (
                      <ul className="divide-y divide-gray-100">
                        {filteredCommunities.map((feature: any, idx: number) => (
                          <li key={idx}>
                            <button
                              onClick={() => handleCommunityClick(feature)}
                              className={cn(
                                "w-full text-left p-3 hover:bg-[#654D81]/5 transition-colors group flex items-center justify-between",
                                selectedCommunity === feature ? "bg-[#654D81]/10" : ""
                              )}
                            >
                              <div>
                                <span className="text-sm font-medium text-gray-800 group-hover:text-[#654D81] transition-colors">
                                  {feature.properties?.ciu_com || feature.properties?.name || feature.properties?.NOMBRE || feature.properties?.Comunidad || 'Comunidad Sin Nombre'}
                                </span>
                                {feature.properties?.mpio && (
                                  <p className="text-xs text-gray-500 mt-0.5">{feature.properties.mpio}</p>
                                )}
                              </div>
                              <MapPin className="w-4 h-4 text-gray-400 group-hover:text-[#654D81] transition-colors" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-6 text-center text-sm text-gray-500">
                        No se encontraron comunidades.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STATS MOVED TO LEFT PANEL */}
            </div>

            <div className="h-6 bg-[#EFEAE2]/95" />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ADDITIONAL MAP CONTROLS - REPOSITIONED */}
      <div
        className={cn(
          "fixed top-24 z-[1000] flex flex-col gap-3 transition-all duration-500",
          isGalleryOpen && activeLayer.gallery.length > 0 ? "right-[430px]" : "right-10"
        )}
      >
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className={cn(
            "bg-[#EFEAE2] p-4 rounded-[1.5rem] shadow-2xl transition-all border border-outline-variant/20 active:scale-95 group font-black",
            isPanelOpen ? "text-[#654D81] hover:bg-[#654D81]/10" : "bg-[#B0946D] text-white border-[#B0946D]"
          )}
          title={isPanelOpen ? "Ocultar Panel Atlas" : "Mostrar Panel Atlas"}
        >
          <ChevronLeft className={cn("w-5 h-5 transition-transform", !isPanelOpen && "rotate-180")} />
        </button>

        <button
          onClick={() => setIsGalleryOpen(!isGalleryOpen)}
          className={cn(
            "bg-[#EFEAE2] p-4 rounded-[1.5rem] shadow-2xl transition-all border border-outline-variant/20 active:scale-95 group font-black",
            isGalleryOpen ? "text-[#654D81] hover:bg-[#654D81]/10" : "bg-[#397C85] text-white border-[#397C85] shadow-lg shadow-[#397C85]/20"
          )}
          title={isGalleryOpen ? "Ocultar Galería" : "Mostrar Galería"}
        >
          <Maximize2 className={cn("w-5 h-5 transition-transform", isGalleryOpen && "scale-110")} />
        </button>


      </div>
    </div>
  );
}
