package com.radhajap.app.data

data class AppSettings(
    val soundEnabled: Boolean = true,
    val vibrationEnabled: Boolean = true,
    val voiceEnabled: Boolean = true,
    val speechRate: Float = 1.0f,
    val speechPitch: Float = 1.0f,
    val language: String = "hi", // "hi", "en", "sa"
    val mantra: String = "राधा",
    val dailyGoal: Int = 108
)

data class BestDay(
    val date: String = "",
    val count: Int = 0
)

data class AppState(
    val todayCount: Int = 0,
    val lifetimeCount: Int = 0,
    val streak: Int = 0,
    val lastActiveDate: String = "",
    val history: Map<String, Int> = emptyMap(),
    val bestDay: BestDay = BestDay(),
    val settings: AppSettings = AppSettings(),
    val unlockedMilestones: List<Int> = emptyList()
)

val DEFAULT_MILESTONES = listOf(108, 500, 1008, 5000, 10008, 50000, 100008)
