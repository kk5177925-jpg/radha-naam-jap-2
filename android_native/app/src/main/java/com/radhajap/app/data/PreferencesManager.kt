package com.radhajap.app.data

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class PreferencesManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("radha_jaap_prefs", Context.MODE_PRIVATE)
    private val gson = Gson()

    fun getTodayDateString(): String {
        return SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
    }

    fun loadState(): AppState {
        val today = getTodayDateString()
        var todayCount = prefs.getInt("todayCount", 0)
        var lifetimeCount = prefs.getInt("lifetimeCount", 0)
        var streak = prefs.getInt("streak", 0)
        var lastActiveDate = prefs.getString("lastActiveDate", "") ?: ""

        val historyJson = prefs.getString("history", "{}") ?: "{}"
        val type = object : TypeToken<Map<String, Int>>() {}.type
        val history: MutableMap<String, Int> = try {
            gson.fromJson(historyJson, type) ?: mutableMapOf()
        } catch (e: Exception) {
            mutableMapOf()
        }

        var bestDate = prefs.getString("bestDay_date", today) ?: today
        var bestCount = prefs.getInt("bestDay_count", 0)

        // Midnight date check
        if (lastActiveDate.isNotEmpty() && lastActiveDate != today) {
            if (todayCount > 0) {
                history[lastActiveDate] = todayCount
            }
            // Check streak
            val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
            try {
                val lastDate = dateFormat.parse(lastActiveDate)
                val currentDate = dateFormat.parse(today)
                if (lastDate != null && currentDate != null) {
                    val diff = (currentDate.time - lastDate.time) / (1000 * 60 * 60 * 24)
                    if (diff > 1) {
                        streak = 0
                    }
                }
            } catch (e: Exception) {
                streak = 0
            }
            todayCount = 0
        }

        if (lastActiveDate.isEmpty()) {
            lastActiveDate = today
        }

        val settings = AppSettings(
            soundEnabled = prefs.getBoolean("soundEnabled", true),
            vibrationEnabled = prefs.getBoolean("vibrationEnabled", true),
            voiceEnabled = prefs.getBoolean("voiceEnabled", true),
            speechRate = prefs.getFloat("speechRate", 1.0f),
            speechPitch = prefs.getFloat("speechPitch", 1.0f),
            language = prefs.getString("language", "hi") ?: "hi",
            mantra = prefs.getString("mantra", "राधा") ?: "राधा",
            dailyGoal = prefs.getInt("dailyGoal", 108)
        )

        val milestonesJson = prefs.getString("unlockedMilestones", "[]") ?: "[]"
        val milestoneType = object : TypeToken<List<Int>>() {}.type
        val unlockedMilestones: List<Int> = try {
            gson.fromJson(milestonesJson, milestoneType) ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }

        return AppState(
            todayCount = todayCount,
            lifetimeCount = lifetimeCount,
            streak = streak,
            lastActiveDate = lastActiveDate,
            history = history,
            bestDay = BestDay(bestDate, bestCount),
            settings = settings,
            unlockedMilestones = unlockedMilestones
        )
    }

    fun saveState(state: AppState) {
        val editor = prefs.edit()
        editor.putInt("todayCount", state.todayCount)
        editor.putInt("lifetimeCount", state.lifetimeCount)
        editor.putInt("streak", state.streak)
        editor.putString("lastActiveDate", state.lastActiveDate)
        editor.putString("history", gson.toJson(state.history))
        editor.putString("bestDay_date", state.bestDay.date)
        editor.putInt("bestDay_count", state.bestDay.count)

        editor.putBoolean("soundEnabled", state.settings.soundEnabled)
        editor.putBoolean("vibrationEnabled", state.settings.vibrationEnabled)
        editor.putBoolean("voiceEnabled", state.settings.voiceEnabled)
        editor.putFloat("speechRate", state.settings.speechRate)
        editor.putFloat("speechPitch", state.settings.speechPitch)
        editor.putString("language", state.settings.language)
        editor.putString("mantra", state.settings.mantra)
        editor.putInt("dailyGoal", state.settings.dailyGoal)

        editor.putString("unlockedMilestones", gson.toJson(state.unlockedMilestones))
        editor.apply()
    }
}
