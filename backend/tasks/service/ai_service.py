import os
import time
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

def analyze_task_with_ai(title, description):

    llm = ChatOpenAI(
        model="gpt-4o-mini", 
        api_key=os.getenv("OPENAI_API_KEY")
    )

    prompt = ChatPromptTemplate.from_template(
        "Eres un asistente de productividad. Analiza la siguiente tarea:\n"
        "Título: {title}\n"
        "Descripción: {description}\n\n"
        "Genera una respuesta en formato JSON estrictamente con las siguientes llaves:\n"
        "1. 'category': Clasifica en (Trabajo, Personal, Urgente, o Salud).\n"
        "2. 'subtasks': Una lista de máximo 3 pasos cortos para completar la tarea."
    )

    chain = prompt | llm | JsonOutputParser()

    try:
        response = chain.invoke({"title": title, "description": description})
        print("--- RESPUESTA DE LA IA ---")
        print(response)
        return response
    except Exception as e:
        print(f"--- FALLO IA ({e}). ACTIVANDO MOCK ---", flush=True)
        
        time.sleep(1) 
        text_to_analyze = (title + " " + description).lower()
        if any(word in text_to_analyze for word in ["salud", "ejercicio", "medico", "entrenar"]):
            category = "Salud"
            subtasks = ["Programar recordatorio", "Preparar equipo necesario", "Seguir rutina"]
        elif any(word in text_to_analyze for word in ["trabajo", "api", "reunion", "proyecto"]):
            category = "Trabajo"
            subtasks = ["Revisar objetivos", "Contactar interesados", "Documentar progreso"]
        elif any(word in text_to_analyze for word in ["casa", "comprar", "limpiar", "personal"]):
            category = "Personal"
            subtasks = ["Hacer inventario", "Definir presupuesto", "Finalizar tarea"]
        else:
            category = "Urgente"
            subtasks = ["Identificar problema", "Actuar de inmediato", "Verificar solución"]

        return {
            "category": category, 
            "subtasks": subtasks
        }