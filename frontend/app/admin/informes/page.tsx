"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Download } from "lucide-react"
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, PageBreak, AlignmentType, WidthType } from "docx"
import { saveAs } from "file-saver"
import { Bar } from 'react-chartjs-2'
import { toPng } from 'html-to-image'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Registrar componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
    borderColor: string
    borderWidth: number
  }[]
}

// Componente para el gráfico de barras
const BarChart = ({ data, hidden = false }: { data: ChartData; hidden?: boolean }) => {
  const chartRef = useRef<HTMLDivElement>(null)

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Resultados por Aspecto Evaluado',
      },
    },
  }

  return (
    <div ref={chartRef} style={{ display: hidden ? 'none' : 'block', width: '800px', height: '400px' }}>
      <Bar options={options} data={data} />
    </div>
  )
}

// Opciones de tipo de informe
const reportTypes: Array<{ id: 'programa' | 'facultad' | 'institucional', label: string }> = [
  { id: "programa", label: "Informe por Programa" },
  { id: "facultad", label: "Informe por Facultad" },
  { id: "institucional", label: "Informe Institucional" },
]

export default function InformesPage() {
  const [selectedType, setSelectedType] = useState<'programa' | 'facultad' | 'institucional' | null>(null)
  const [loading, setLoading] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  // Estados para datos y filtros
  const [selectedPrograma, setSelectedPrograma] = useState<string>("")
  const [selectedFacultad, setSelectedFacultad] = useState<string>("")
  const [chartData, setChartData] = useState<ChartData>({
    labels: ['Metodología', 'Dominio', 'Evaluación', 'Puntualidad', 'Comunicación'],
    datasets: [
      {
        label: 'Promedio',
        data: [85, 90, 78, 88, 92],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      },
    ],
  })

  // Simulación de datos y filtros (reemplazar por datos reales de la API)
  const programas = ["Ingeniería de Sistemas", "Administración", "Contaduría"]
  const facultades = ["Ingeniería", "Ciencias Económicas"]

  // CONFIGURACIONES PARA CADA TIPO DE INFORME
  interface DatosInforme {
    tipo?: 'programa' | 'facultad' | 'institucional';
    periodo?: string;
    facultad?: string;
    programa?: string;
    promedioGeneral?: number;
    fortalezasConsolidadas?: string[];
    aspectosMejoraConsolidados?: string[];
    docentes?: {
        nombre: string;
        promedio: number;
        unidadesFormacion: {
            nombre: string;
            grupo: string;
            programa: string;
            promedio: number;
            aspectosResaltar: string[];
            aspectosMejora: string[];
            aspectosUnidadEstudiantes: string[];
        }[];
    }[];
    directorPrograma?: string;
}

  function obtenerConfiguracionPlantilla(tipoInforme: 'programa' | 'facultad' | 'institucional', datosInforme: DatosInforme = {}): any {
    const configuraciones = {
      'programa': {
        nombreFacultad: datosInforme.facultad || "FACULTAD DE INGENIERÍA Y CIENCIAS BÁSICAS",
        nombrePrograma: datosInforme.programa || "INGENIERÍA DE SISTEMAS POR CICLOS",
        alcance: "el programa",
        subtituloResultado: "CONSOLIDADO GENERAL DE TODOS LOS DOCENTES DEL PROGRAMA",
        tituloPromedio: "del Programa"
      },
      'facultad': {
        nombreFacultad: datosInforme.facultad || "FACULTAD DE INGENIERÍA Y CIENCIAS BÁSICAS",
        nombrePrograma: "CONSOLIDADO FACULTAD",
        alcance: "la facultad",
        subtituloResultado: "CONSOLIDADO GENERAL DE TODOS LOS PROGRAMAS DE LA FACULTAD",
        tituloPromedio: "de la Facultad"
      },
      'institucional': {
        nombreFacultad: "CONSOLIDADO INSTITUCIONAL",
        nombrePrograma: "TODAS LAS FACULTADES",
        alcance: "la institución",
        subtituloResultado: "CONSOLIDADO GENERAL DE TODAS LAS FACULTADES",
        tituloPromedio: "Institucional"
      }
    };
    
    return configuraciones[tipoInforme] || configuraciones['programa'];
  }

  // CREAR PRIMERA PÁGINA - PLANTILLA OFICIAL EXACTA
  function crearPaginaPlantillaOficial(tipoInforme: 'programa' | 'facultad' | 'institucional', datosInforme: DatosInforme) {
    const config = obtenerConfiguracionPlantilla(tipoInforme, datosInforme);
    const periodo = datosInforme.periodo || "2025-1";
    
    return [
        // 1. FACULTAD (centrado, negrita)
        new Paragraph({
            children: [
                new TextRun({
                    text: config.nombreFacultad,
                    bold: true,
                    size: 28
                })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
        }),
        
        // 2. PROGRAMA (centrado, negrita)
        new Paragraph({
            children: [
                new TextRun({
                    text: `PROGRAMA: ${config.nombrePrograma}`,
                    bold: true,
                    size: 26
                })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
        }),
        
        // 3. INFORME EVALUACIÓN IN-SITU (centrado, negrita)
        new Paragraph({
            children: [
                new TextRun({
                    text: "INFORME EVALUACIÓN IN-SITU",
                    bold: true,
                    size: 26
                })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
        }),
        
        // 4. PERIODO (centrado, negrita)
        new Paragraph({
            children: [
                new TextRun({
                    text: `PERIODO ${periodo}`,
                    bold: true,
                    size: 24
                })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
        }),
        
        // 5. ORIENTACIÓN SOBRE EL DIALOGO FORMATIVO... (centrado, negrita)
        new Paragraph({
            children: [
                new TextRun({
                    text: "ORIENTACIÓN SOBRE EL DIALOGO FORMATIVO ENTRE DIRECTOR DE PROGRAMA Y ESTUDIANTES EN EL MARCO DE LA EVALUACIÓN DEL DESEMPEÑO DOCENTE",
                    bold: true,
                    size: 22
                })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
        }),
        
        // 6. ACTIVIDAD IN SITU (centrado, negrita)
        new Paragraph({
            children: [
                new TextRun({
                    text: "ACTIVIDAD IN SITU",
                    bold: true,
                    size: 20
                })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
        }),
        
        // 7. Párrafo explicativo 1 (justificado)
        new Paragraph({
            children: [
                new TextRun({
                    text: "Con base en las diferentes opiniones que manifestaron los estudiantes, se procedió a marcar los aspectos más relevantes y tomar nota de aquellos que, si bien no son relevantes, pueden tener un significado importante y/o diferenciador para la continuidad del proceso académico y que se debe atender antes de finalizar el semestre para mejorar o para fortalecer.",
                    size: 22
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 }
        }),
        
        // 8. Párrafo del Acuerdo 31 (justificado)
        new Paragraph({
            children: [
                new TextRun({
                    text: "El Acuerdo 31 de junio de 2020 del Consejo Académico estableció el siguiente rango de clasificación para el análisis de la evaluación: Excelente (E), Bueno (B), Aceptable (A), Deficiente (D).",
                    size: 22
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 }
        }),
        
        // 9. Párrafo del Artículo 2 (justificado, con formato específico)
        new Paragraph({
            children: [
                new TextRun({
                    text: "Así mismo, se tiene en cuenta el Artículo 2, numeral 12, literal ",
                    size: 22
                }),
                new TextRun({
                    text: "a. Diálogo formativo de la 4ta semana:",
                    bold: true,
                    size: 22
                }),
                new TextRun({
                    text: " corresponde a una ",
                    size: 22
                }),
                new TextRun({
                    text: "valoración cualitativa acerca del desarrollo del curso, del profesor y de los estudiantes",
                    italics: true,
                    size: 22
                }),
                new TextRun({
                    text: ", que se efectúe entre la 4ta y 6ta semana, la cual brinda un espacio para un diálogo constructivo que brinde retroalimentación temprana y permita en casos necesarios, tomar correctivos a tiempo; su finalidad es estrictamente formativa y debe quedar un registro escrito que se remite a los docentes y coordinadores de grupos internos de trabajo de facultades para su seguimiento.",
                    size: 22
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 }
        }),
        
        // 10. Párrafo de cierre con alcance dinámico (justificado)
        new Paragraph({
            children: [
                new TextRun({
                    text: `A continuación, se presenta el informe del diálogo formativo realizado por ${config.alcance} correspondiente al periodo ${periodo}, el cual se consolida desde los argumentos expresados por los estudiantes para cada unidad de formación y por cada docente.`,
                    size: 22
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    ];
  }
  const crearSubtituloSegunTipo = (tipoInforme: 'programa' | 'facultad' | 'institucional') => {
    const subtitulos = {
      programa: "CONSOLIDADO GENERAL DE TODOS LOS DOCENTES DEL PROGRAMA",
      facultad: "CONSOLIDADO GENERAL DE TODOS LOS PROGRAMAS DE LA FACULTAD",
      institucional: "CONSOLIDADO GENERAL DE TODAS LAS FACULTADES"
    }
    return [
      new Paragraph({
        children: [new TextRun({ text: subtitulos[tipoInforme], bold: true, size: 40 })],
        alignment: AlignmentType.CENTER
      })
    ]
  }
  const obtenerTituloPromedio = (tipoInforme: 'programa' | 'facultad' | 'institucional') => {
    const titulos = {
      programa: "del Programa",
      facultad: "de la Facultad",
      institucional: "Institucional"
    }
    return titulos[tipoInforme]
  }

  function crearTablaResumen(datosInforme: DatosInforme) {
    const fortalezas = datosInforme.fortalezasConsolidadas || ["Trabajo en equipo", "Comunicación"];
    const aspectosMejora = datosInforme.aspectosMejoraConsolidados || ["Uso de TIC", "Retroalimentación"];
    return [
      new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Resumen Fortalezas",
                        bold: true,
                        size: 22
                      })
                    ],
                    alignment: AlignmentType.CENTER
                  })
                ],
                shading: { fill: "D9D9D9" },
                width: { size: 50, type: WidthType.PERCENTAGE }
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Resumen Aspectos de Mejora",
                        bold: true,
                        size: 22
                      })
                    ],
                    alignment: AlignmentType.CENTER
                  })
                ],
                shading: { fill: "D9D9D9" },
                width: { size: 50, type: WidthType.PERCENTAGE }
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                children: fortalezas.map((fortaleza, index) => 
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${index + 1}. ${fortaleza}`,
                        size: 20
                      })
                    ],
                    spacing: { after: 100 }
                  })
                ),
                width: { size: 50, type: WidthType.PERCENTAGE }
              }),
              new TableCell({
                children: aspectosMejora.map((aspecto, index) => 
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${index + 1}. ${aspecto}`,
                        size: 20
                      })
                    ],
                    spacing: { after: 100 }
                  })
                ),
                width: { size: 50, type: WidthType.PERCENTAGE }
              })
            ]
          })
        ],
        width: { size: 100, type: WidthType.PERCENTAGE }
      })
    ]
  }

  const crearContenidoEspecifico = async (tipoInforme: 'programa' | 'facultad' | 'institucional', datosInforme: DatosInforme) => {
    let imageBase64 = ''

    if (chartRef.current) {
      try {
        const dataUrl = await toPng(chartRef.current)
        imageBase64 = dataUrl.split(',')[1]
      } catch (error) {
        console.error('Error al generar la imagen del gráfico:', error)
        throw new Error('No se pudo generar la imagen del gráfico. Por favor, intente nuevamente.')
      }
    }

    return [
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({ 
        children: [new TextRun({ text: "RESULTADO GENERAL", bold: true, size: 48 })],
        alignment: AlignmentType.CENTER 
      }),
      new Paragraph({ children: [new TextRun({ text: `PERIODO ${datosInforme.periodo || "2025-1"}`, bold: true, size: 40 })], alignment: AlignmentType.CENTER }),
      ...crearSubtituloSegunTipo(tipoInforme),
      new Paragraph({ children: [new TextRun({ text: "[GRÁFICO DE BARRAS AQUÍ]", italics: true, size: 36 })], alignment: AlignmentType.CENTER }),
      new Paragraph({ children: [new TextRun({ text: `Promedio General ${obtenerTituloPromedio(tipoInforme)} ${datosInforme.promedioGeneral || 0}%`, bold: true, size: 40 })], alignment: AlignmentType.CENTER }),
      ...crearTablaResumen(datosInforme),
      // Aquí puedes agregar más detalles según el tipo de informe
    ]
  }

  const generarDocumentoWord = async (tipoInforme: 'programa' | 'facultad' | 'institucional', datosInforme: DatosInforme) => {
    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // 1. PRIMERA PÁGINA - PLANTILLA OFICIAL
              ...crearPaginaPlantillaOficial(tipoInforme, datosInforme),
              ...await crearContenidoEspecifico(tipoInforme, datosInforme)
            ]
          }
        ]
      })
      const blob = await Packer.toBlob(doc)
      const nombreArchivo = `Informe_${tipoInforme}_${datosInforme.periodo || "2025-1"}_${new Date().toISOString().split('T')[0]}.docx`
      saveAs(blob, nombreArchivo)
    } catch (error) {
      console.error('Error al generar el documento Word:', error)
      alert('Ocurrió un error al generar el documento Word. Por favor, intente nuevamente.')
    }
  }
  // Reemplaza estos datos por los reales del sistema
  const datosInforme: DatosInforme = {
    facultad: "FACULTAD DE INGENIERÍA Y CIENCIAS BÁSICAS",
    programa: "INGENIERÍA DE SISTEMAS POR CICLOS",
    periodo: "2025-1",
    promedioGeneral: 87.5,
    fortalezasConsolidadas: ["Trabajo en equipo", "Comunicación"],
    aspectosMejoraConsolidados: ["Uso de TIC", "Retroalimentación"],
    tipo: selectedType || "programa"
  }

  const handleDownloadWord = async () => {
    setLoading(true)
    await generarDocumentoWord(selectedType || "programa", datosInforme)
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Generar Informe</CardTitle>
          <CardDescription>
            Seleccione el tipo de informe y los filtros correspondientes. Puede descargar el informe en formato Word.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            {reportTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? "default" : "outline"}
                onClick={() => setSelectedType(type.id)}
              >
                {type.label}
              </Button>
            ))}
          </div>

          {/* Filtros dinámicos según tipo de informe */}
          {selectedType === "programa" && (
            <div className="mb-4">
              <label className="block mb-1 font-medium">Programa:</label>              <select 
                className="border rounded px-2 py-1"
                value={selectedPrograma}
                onChange={(e) => setSelectedPrograma(e.target.value)}
              >
                <option value="">Seleccione un programa</option>
                {programas.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          )}
          {selectedType === "facultad" && (
            <div className="mb-4">
              <label className="block mb-1 font-medium">Facultad:</label>              <select 
                className="border rounded px-2 py-1"
                value={selectedFacultad}
                onChange={(e) => setSelectedFacultad(e.target.value)}
              >
                <option value="">Seleccione una facultad</option>
                {facultades.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          )}

          {/* Botón de descarga */}
          <Button
            onClick={handleDownloadWord}
            disabled={!selectedType || loading}
            className="mt-4"
          >
            <Download className="h-4 w-4 mr-2" />
            {loading ? "Generando..." : "Descargar Word"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
