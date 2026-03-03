from django.test import TestCase
from .service.ai_service import analyze_task_with_ai

class AIMockTest(TestCase):
    def test_mock_fallback_logic(self):
        """Verifica que el mock categoriza correctamente según el título"""
        # Caso Salud
        res_salud = analyze_task_with_ai("Entrenar mañana", "Ir al gimnasio")
        self.assertEqual(res_salud['category'], "Salud")
        
        # Caso Trabajo
        res_trabajo = analyze_task_with_ai("Reunión de API", "Hablar con el equipo")
        self.assertEqual(res_trabajo['category'], "Trabajo")
        
        # Verificar que devuelve subtareas
        self.assertTrue(len(res_trabajo['subtasks']) > 0)

    def test_mock_default_category(self):
        """Verifica la categoría por defecto si no hay palabras clave"""
        res_random = analyze_task_with_ai("Hacer algo", "Cualquier cosa")
        self.assertEqual(res_random['category'], "Urgente")