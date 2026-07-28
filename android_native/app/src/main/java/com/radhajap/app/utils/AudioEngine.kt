package com.radhajap.app.utils

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.speech.tts.TextToSpeech
import java.util.Locale

class AudioEngine(private val context: Context) : TextToSpeech.OnInitListener {
    private var tts: TextToSpeech? = null
    private var isTtsReady = false
    private val vibrator: Vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
        vibratorManager.defaultVibrator
    } else {
        @Suppress("DEPRECATION")
        context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
    }

    init {
        tts = TextToSpeech(context, this)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = tts?.setLanguage(Locale("hi", "IN"))
            if (result != TextToSpeech.LANG_MISSING_DATA && result != TextToSpeech.LANG_NOT_SUPPORTED) {
                isTtsReady = true
            }
        }
    }

    fun speak(text: String, rate: Float = 1.0f, pitch: Float = 1.0f) {
        if (!isTtsReady || tts == null) return
        tts?.setSpeechRate(rate)
        tts?.setPitch(pitch)
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "radha_speak")
    }

    fun triggerVibration(durationMs: Long = 40) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                vibrator.vibrate(durationMs)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun playTapAudioSound() {
        // Synthesize a soft warm frequency tone
        playTone(frequency = 528.0, durationMs = 120)
    }

    fun playTempleBell() {
        playTone(frequency = 528.0, durationMs = 1500)
    }

    fun playShankhSound() {
        playTone(frequency = 432.0, durationMs = 2500)
    }

    private fun playTone(frequency: Double, durationMs: Int) {
        Thread {
            try {
                val sampleRate = 44100
                val numSamples = durationMs * sampleRate / 1000
                val sample = DoubleArray(numSamples)
                val generatedSnd = ByteArray(2 * numSamples)

                for (i in 0 until numSamples) {
                    val t = i.toDouble() / sampleRate
                    // Exponential decay
                    val envelope = Math.exp(-3.0 * t / (durationMs / 1000.0))
                    sample[i] = Math.sin(2.0 * Math.PI * frequency * t) * envelope
                }

                var idx = 0
                for (dVal in sample) {
                    val valShort = (dVal * 32767).toInt().toShort()
                    generatedSnd[idx++] = (valShort.toInt() and 0x00ff).toByte()
                    generatedSnd[idx++] = (valShort.toInt() and 0xff00 shr 8).toByte()
                }

                val audioTrack = AudioTrack.Builder()
                    .setAudioAttributes(
                        AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_MEDIA)
                            .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                            .build()
                    )
                    .setAudioFormat(
                        AudioFormat.Builder()
                            .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                            .setSampleRate(sampleRate)
                            .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                            .build()
                    )
                    .setBufferSizeInBytes(generatedSnd.size)
                    .build()

                audioTrack.write(generatedSnd, 0, generatedSnd.size)
                audioTrack.play()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }.start()
    }

    fun shutdown() {
        tts?.stop()
        tts?.shutdown()
    }
}
