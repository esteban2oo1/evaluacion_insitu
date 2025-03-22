import { NextResponse } from "next/server"
import type { Evaluation } from "@/lib/types"

// Simulación de base de datos
const evaluations: Evaluation[] = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const studentId = searchParams.get("studentId")
  const teacherId = searchParams.get("teacherId")
  const courseId = searchParams.get("courseId")

  let filteredEvaluations = [...evaluations]

  if (studentId) {
    filteredEvaluations = filteredEvaluations.filter(
      (eval) => eval.studentId === studentId
    );
  }

  if (teacherId) {
    filteredEvaluations = filteredEvaluations.filter(
      (eval) => eval.teacherId === teacherId
    );
  }

  if (courseId) {
    filteredEvaluations = filteredEvaluations.filter(
      (eval) => eval.courseId === Number(courseId)
    );
  }

  return NextResponse.json({ evaluations: filteredEvaluations })
}

export async function POST(request: Request) {
  try {
    const evaluation = await request.json()

    // Validar datos
    if (!evaluation.studentId || !evaluation.teacherId || !evaluation.courseId) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    // Generar ID único
    const newEvaluation: Evaluation = {
      ...evaluation,
      id: Date.now().toString(),
      date: new Date(),
    }

    // Guardar evaluación
    evaluations.push(newEvaluation)

    return NextResponse.json({
      success: true,
      evaluation: newEvaluation,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al guardar la evaluación" }, { status: 500 })
  }
}

