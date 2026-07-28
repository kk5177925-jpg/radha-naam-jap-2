package com.radhajap.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.Circle
import androidx.compose.material.icons.filled.SelfImprovement
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.radhajap.app.data.DEFAULT_MILESTONES
import com.radhajap.app.data.PreferencesManager
import com.radhajap.app.ui.components.JapButton
import com.radhajap.app.ui.components.MalaView
import com.radhajap.app.ui.components.MilestoneModal
import com.radhajap.app.ui.components.PetalCanvas
import com.radhajap.app.ui.components.SettingsView
import com.radhajap.app.ui.components.StatsView
import com.radhajap.app.ui.theme.DevotionalBg
import com.radhajap.app.ui.theme.GoldAmber
import com.radhajap.app.ui.theme.GoldLight
import com.radhajap.app.ui.theme.RadhaJaapTheme
import com.radhajap.app.ui.theme.SurfaceDark
import com.radhajap.app.utils.AudioEngine

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            RadhaJaapTheme {
                MainAppScreen()
            }
        }
    }
}

@Composable
fun MainAppScreen() {
    val context = LocalContext.current
    val prefsManager = remember { PreferencesManager(context) }
    val audioEngine = remember { AudioEngine(context) }

    DisposableEffect(Unit) {
        onDispose {
            audioEngine.shutdown()
        }
    }

    var appState by remember { mutableStateOf(prefsManager.loadState()) }
    var selectedTab by remember { mutableStateOf(0) } // 0: Jaap, 1: Mala, 2: Stats, 3: Settings
    var activeMilestone by remember { mutableStateOf<Int?>(null) }

    val handleTap: () -> Unit = {
        val newTodayCount = appState.todayCount + 1
        val newLifetimeCount = appState.lifetimeCount + 1

        val newHistory = appState.history.toMutableMap()
        newHistory[appState.lastActiveDate] = newTodayCount

        var newBestDate = appState.bestDay.date
        var newBestCount = appState.bestDay.count
        if (newTodayCount > newBestCount) {
            newBestDate = appState.lastActiveDate
            newBestCount = newTodayCount
        }

        // Haptic & Audio feedback
        if (appState.settings.vibrationEnabled) {
            audioEngine.triggerVibration(40)
        }
        if (appState.settings.soundEnabled) {
            audioEngine.playTapAudioSound()
        }
        if (appState.settings.voiceEnabled) {
            audioEngine.speak(
                text = appState.settings.mantra,
                rate = appState.settings.speechRate,
                pitch = appState.settings.speechPitch
            )
        }

        // Check milestones
        val unlockedList = appState.unlockedMilestones.toMutableList()
        DEFAULT_MILESTONES.forEach { milestone ->
            if (newLifetimeCount >= milestone && !unlockedList.contains(milestone)) {
                unlockedList.add(milestone)
                activeMilestone = milestone
                audioEngine.playShankhSound()
            }
        }

        // Mala completion check (108)
        if (newTodayCount % 108 == 0) {
            audioEngine.playTempleBell()
        }

        val updatedState = appState.copy(
            todayCount = newTodayCount,
            lifetimeCount = newLifetimeCount,
            history = newHistory,
            bestDay = appState.bestDay.copy(date = newBestDate, count = newBestCount),
            unlockedMilestones = unlockedList
        )

        appState = updatedState
        prefsManager.saveState(updatedState)
    }

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = SurfaceDark,
                contentColor = GoldAmber
            ) {
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = { Icon(Icons.Default.SelfImprovement, contentDescription = "Jaap") },
                    label = { Text("जाप", fontSize = 12.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = GoldAmber,
                        unselectedIconColor = Color.Gray,
                        selectedTextColor = GoldAmber,
                        unselectedTextColor = Color.Gray,
                        indicatorColor = DevotionalBg
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Icon(Icons.Default.Circle, contentDescription = "Mala") },
                    label = { Text("माला", fontSize = 12.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = GoldAmber,
                        unselectedIconColor = Color.Gray,
                        selectedTextColor = GoldAmber,
                        unselectedTextColor = Color.Gray,
                        indicatorColor = DevotionalBg
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    icon = { Icon(Icons.Default.BarChart, contentDescription = "Stats") },
                    label = { Text("प्रगति", fontSize = 12.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = GoldAmber,
                        unselectedIconColor = Color.Gray,
                        selectedTextColor = GoldAmber,
                        unselectedTextColor = Color.Gray,
                        indicatorColor = DevotionalBg
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    icon = { Icon(Icons.Default.Settings, contentDescription = "Settings") },
                    label = { Text("सेटिंग्स", fontSize = 12.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = GoldAmber,
                        unselectedIconColor = Color.Gray,
                        selectedTextColor = GoldAmber,
                        unselectedTextColor = Color.Gray,
                        indicatorColor = DevotionalBg
                    )
                )
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(DevotionalBg)
                .padding(innerPadding)
        ) {
            PetalCanvas()

            when (selectedTab) {
                0 -> MainJaapView(appState = appState, onTap = handleTap)
                1 -> MalaView(todayCount = appState.todayCount, onTap = handleTap)
                2 -> StatsView(state = appState)
                3 -> SettingsView(
                    state = appState,
                    onUpdateSettings = { newSettings ->
                        val updated = appState.copy(settings = newSettings)
                        appState = updated
                        prefsManager.saveState(updated)
                    },
                    onResetCounter = {
                        val updated = appState.copy(todayCount = 0)
                        appState = updated
                        prefsManager.saveState(updated)
                    }
                )
            }

            activeMilestone?.let { milestone ->
                MilestoneModal(
                    milestone = milestone,
                    onDismiss = { activeMilestone = null }
                )
            }
        }
    }
}

@Composable
fun MainJaapView(
    appState: AppState,
    onTap: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "🪷 राधा नाम जाप 🪷",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = GoldLight
        )

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "${appState.todayCount}",
            fontSize = 54.sp,
            fontWeight = FontWeight.ExtraBold,
            color = GoldAmber
        )
        Text(
            text = "आज का कुल जाप (${appState.todayCount / 108} माला)",
            fontSize = 14.sp,
            color = Color(0xFFFDE68A)
        )

        Spacer(modifier = Modifier.height(36.dp))

        JapButton(
            mantraText = appState.settings.mantra,
            onTap = onTap
        )

        Spacer(modifier = Modifier.height(36.dp))

        Text(
            text = "जीवनकाल कुल: ${appState.lifetimeCount} | निरंतर: ${appState.streak} दिन",
            fontSize = 13.sp,
            color = Color.LightGray,
            fontWeight = FontWeight.Medium
        )
    }
}
