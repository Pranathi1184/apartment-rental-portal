import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex flex-col min-h-screen">
      <!-- Hero Section -->
      <header class="bg-gradient-to-r from-indigo-700 to-purple-700 text-white pt-20 pb-24 px-6 relative overflow-hidden">
        <div class="absolute inset-0 bg-black opacity-10 pattern-dots"></div>
        <div class="container mx-auto relative z-10 text-center">
          <h1 class="text-4xl md:text-6xl font-extrabold mb-6 leading-tight animate-fade-in-up">
            Elevate Your Living Experience
          </h1>
          <p class="text-xl md:text-2xl mb-10 text-indigo-100 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Discover modern apartments, seamless payments, and a vibrant community with SkyLine Living.
          </p>
          <div class="flex justify-center gap-4 animate-fade-in-up delay-200">
            <a routerLink="/login" class="bg-white text-indigo-700 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg">
              Get Started
            </a>
            <a href="#features" class="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-indigo-700 transition-all duration-300 text-lg">
              Learn More
            </a>
          </div>
        </div>
      </header>

      <!-- Key Features -->
      <section id="features" class="py-20 bg-gray-50">
        <div class="container mx-auto px-6">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose SkyLine?</h2>
            <p class="text-xl text-gray-600">Everything you need for a comfortable lifestyle.</p>
          </div>
          
          <div class="grid md:grid-cols-3 gap-10">
            <!-- Feature 1 -->
            <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center group">
              <div class="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                <span class="text-3xl group-hover:text-white transition-colors">🏠</span>
              </div>
              <h3 class="text-xl font-bold mb-3 text-gray-900">Modern Units</h3>
              <p class="text-gray-600">Spacious, well-designed apartments with top-tier amenities and stunning views.</p>
            </div>

            <!-- Feature 2 -->
            <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center group">
              <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                <span class="text-3xl group-hover:text-white transition-colors">💳</span>
              </div>
              <h3 class="text-xl font-bold mb-3 text-gray-900">Easy Payments</h3>
              <p class="text-gray-600">Secure, one-tap rent payments and automated receipts directly from your dashboard.</p>
            </div>

            <!-- Feature 3 -->
            <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center group">
              <div class="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-pink-600 transition-colors duration-300">
                <span class="text-3xl group-hover:text-white transition-colors">🤝</span>
              </div>
              <h3 class="text-xl font-bold mb-3 text-gray-900">Community Connect</h3>
              <p class="text-gray-600">Find trusted local helpers like maids and cooks, verified by your community.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="py-20 bg-white">
        <div class="container mx-auto px-6">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p class="text-xl text-gray-600">Your journey to a perfect home in 3 steps.</p>
          </div>

          <div class="flex flex-col md:flex-row justify-center items-center gap-8 relative">
             <!-- Step 1 -->
             <div class="flex-1 text-center relative z-10">
               <div class="bg-gray-900 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">1</div>
               <h3 class="text-xl font-bold mb-2">Browse & Tour</h3>
               <p class="text-gray-600">Explore available units online or schedule a physical tour.</p>
             </div>
             
             <!-- Connector Line (Desktop) -->
             <div class="hidden md:block h-1 bg-gray-200 flex-1 absolute top-6 left-1/6 right-1/6 z-0"></div>

             <!-- Step 2 -->
             <div class="flex-1 text-center relative z-10">
               <div class="bg-gray-900 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">2</div>
               <h3 class="text-xl font-bold mb-2">Apply Online</h3>
               <p class="text-gray-600">Submit your application and get approved in record time.</p>
             </div>

             <!-- Step 3 -->
             <div class="flex-1 text-center relative z-10">
               <div class="bg-gray-900 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">3</div>
               <h3 class="text-xl font-bold mb-2">Move In</h3>
               <p class="text-gray-600">Sign your lease digitally and settle into your new home.</p>
             </div>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="py-20 bg-indigo-50">
        <div class="container mx-auto px-6">
          <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">What Residents Say</h2>
          
          <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div class="bg-white p-8 rounded-xl shadow-md">
              <div class="flex items-center mb-4">
                <div class="text-yellow-400 text-xl">★★★★★</div>
              </div>
              <p class="text-gray-600 mb-6 italic">"SkyLine Living has completely transformed my rental experience. The app makes paying rent so easy!"</p>
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gray-300 rounded-full mr-3 overflow-hidden">
                   <img src="https://ui-avatars.com/api/?name=Priya+S&background=random" alt="User" loading="lazy">
                </div>
                <div>
                  <h4 class="font-bold text-gray-900">Priya Sharma</h4>
                  <p class="text-xs text-gray-500">Resident, Tower A</p>
                </div>
              </div>
            </div>

            <div class="bg-white p-8 rounded-xl shadow-md">
              <div class="flex items-center mb-4">
                <div class="text-yellow-400 text-xl">★★★★★</div>
              </div>
              <p class="text-gray-600 mb-6 italic">"I love the Community Connect feature. Found an amazing cook within days of moving in."</p>
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gray-300 rounded-full mr-3 overflow-hidden">
                   <img src="https://ui-avatars.com/api/?name=Rahul+V&background=random" alt="User" loading="lazy">
                </div>
                <div>
                  <h4 class="font-bold text-gray-900">Rahul Verma</h4>
                  <p class="text-xs text-gray-500">Resident, Tower B</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-20 bg-gradient-to-br from-gray-900 to-black text-white text-center">
        <div class="container mx-auto px-6">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to find your dream home?</h2>
          <p class="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">Join thousands of satisfied residents at SkyLine Living today.</p>
          <a routerLink="/register" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-10 rounded-full transition-all duration-300 text-lg shadow-lg inline-block">
            Join Now
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.8s ease-out forwards;
      opacity: 0;
      transform: translateY(20px);
    }
    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    
    @keyframes fadeInUp {
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class LandingPageComponent implements OnInit {
  meta = inject(Meta);
  title = inject(Title);

  ngOnInit() {
    this.title.setTitle('SkyLine Living - Modern Apartment Rentals in India');
    
    this.meta.addTags([
      { name: 'description', content: 'SkyLine Living: A modern apartment management portal with seamless payments, community connection, and smart living features.' },
      { name: 'keywords', content: 'apartment, rental, india, community, payments, smart home' },
      { property: 'og:title', content: 'SkyLine Living - Elevate Your Living Experience' },
      { property: 'og:description', content: 'Discover modern apartments, seamless payments, and a vibrant community with SkyLine Living.' },
      { property: 'og:image', content: 'assets/og-image.jpg' },
      { property: 'og:type', content: 'website' }
    ]);
  }
}
